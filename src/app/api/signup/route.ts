import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { getServerSession } from "next-auth";
import { generateCode } from "@/utils/Token";
import { sendVerificationEmail } from "@/utils/sendEmail";
import { eq } from "drizzle-orm";
import aj from "@/lib/arcjet";
import { getToken } from "@/lib/sessionTokens";
import { headers } from "next/headers";

interface RequestBody {
  name: string;
  email: string;
  password?: string;
  oauthProvider?: string;
  oauthProviderId?: string;
  reCaptchaToken: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  // console.log("API Called");
  const body: RequestBody = await req.json();
  const userId = body.email;
  const { reCaptchaToken } = body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  try {
    // reCaptcha validation
    try {
      const reCaptchaVerificationResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchaToken}`,
        { method: "POST" }
      );
      const reCaptchaVerification = await reCaptchaVerificationResponse.json();

      if (!reCaptchaVerification.success) {
        return NextResponse.json(
          { message: "Invalid reCaptcha Token" },
          { status: 400 }
        );
      }

      // Session and JWT verification
      try {
        const headersList = headers();
        const ip =
          headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
        const reqHeaderToken = req.headers.get("Authorization") || "";
        const currentTime = Math.floor(Date.now());
        const sessionData = getToken(ip, reqHeaderToken);
        const token = await sessionData;
        const apiExpiry = Number(token.expiresAt);
        // console.log("TOekn Expiry from Dataabse: API ---" + apiExpiry);
        // console.log("Current Time: = API----" + currentTime);

        if (!sessionData) {
          return NextResponse.json({ error: "No Session." }, { status: 403 });
        }
        // const { token } = sessionData;

        if (apiExpiry < currentTime || token.apiKey !== reqHeaderToken) {
          console.log("Token Expired. API RESPONSE");
          return NextResponse.json(
            { error: "Session expired or Invalid." },
            { status: 403 }
          );
        }

        // Rate limiting
        try {
          const decision = await aj.protect(req, { userId, requested: 1 });
          if (decision.isDenied()) {
            return NextResponse.json(
              { error: "Too Many Requests." },
              { status: 429 }
            );
          }

          // Database check and insertion
          try {
            const registeredUser = await db
              .select()
              .from(users)
              .where(eq(users.email, body.email));
            console.log(registeredUser);
            if (registeredUser.length > 0) {
              return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
              );
            }

            let hashedPassword: string | null = null;
            if (body.password) {
              hashedPassword = await hash(body.password, 10);
            }

            const verificationToken = generateCode();
            const [newUser] = await db
              .insert(users)
              .values({
                name: body.name,
                email: body.email,
                password: hashedPassword ?? null,
                oauthProvider: body.oauthProvider || null,
                oauthProviderId: body.oauthProviderId || null,
                profileImage: session?.user?.image || null,
                createdAt: new Date(),
                updatedAt: new Date(),
                email_verified: false,
                verification_token: verificationToken,
              })
              .returning();
            console.log(newUser);

            // Email verification
            try {
              await sendVerificationEmail(body.email, verificationToken);
              return NextResponse.json({
                message: "User registered. Check your email for verification.",
              });
            } catch (emailError) {
              console.error("Failed to send verification email:", emailError);
              return NextResponse.json(
                { message: "User registered but email sending failed." },
                { status: 500 }
              );
            }
          } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
              { message: "Error registering user." },
              { status: 500 }
            );
          }
        } catch (rateLimitError) {
          console.error("Rate limiting failed:", rateLimitError);
          return NextResponse.json(
            { message: "Something went wrong." },
            { status: 500 }
          );
        }
      } catch (sessionError) {
        console.error("Session handling failed:", sessionError);
        return NextResponse.json(
          { message: "Session validation failed." },
          { status: 500 }
        );
      }
    } catch {
      return NextResponse.json(
        { message: "Invalid reCaptcha Token" },
        { status: 400 }
      );
    }
  } catch (generalError) {
    console.error("Error processing the request:", generalError);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}
