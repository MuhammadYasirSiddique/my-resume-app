import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Assuming db instance is already set up in your project
import { passwordResets, users } from "@/db/schema"; // Assuming you have users schema
import { eq } from "drizzle-orm";
import { generateResetToken } from "@/utils/Token"; // Assuming this generates a verification code
import { sendForgotPassLinkEmail } from "@/utils/sendEmail";
import aj from "@/lib/arcjet";
import { getToken } from "@/lib/sessionTokens";
import { headers } from "next/headers";

interface RequestBody {
  email: string;

  reCaptchaToken: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: RequestBody = await req.json();
    // const userId = body.email;
    // console.log(body);
    const { reCaptchaToken, email } = body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    try {
      const reCaptchaVerificationResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchaToken}`,
        { method: "POST" }
      );
      const reCaptchaVerification = await reCaptchaVerificationResponse.json();
      // console.log(reCaptchaToken);
      if (!reCaptchaVerification.success) {
        return NextResponse.json(
          { message: "Invalid reCaptcha Token" },
          { status: 400 }
        );
      }

      try {
        const headersList = headers();
        const ip =
          headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
        const reqHeaderToken = req.headers.get("Authorization") || "";
        // console.log(reqHeaderToken);
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

        //Rate Limiting
        try {
          // const { email } = await req.json();
          const userId = email;
          const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
          // console.log(decision);

          if (decision.isDenied()) {
            return NextResponse.json(
              { error: "Too Many Requests", reason: decision.reason },
              { status: 429 }
            );
          }

          // Validate that the email was passed
          try {
            if (!email) {
              console.log("Email is required.");
              return NextResponse.json(
                { message: "Bad Request " },
                { status: 400 }
              );
            }

            const user = await db
              .select()
              .from(users)
              .where(eq(users.email, email));
            const foundUser = user[0];
            // console.log(foundUser);

            if (!foundUser) {
              return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
              );
            }

            const resetPasswordCode = generateResetToken();
            // console.log(resetPasswordCode);
            await db.insert(passwordResets).values({
              userId: foundUser.id,
              token: resetPasswordCode,
              expiresAt: new Date(Date.now() + 3600000),
              createdAt: new Date(),
              old_password: foundUser.password,
            });

            await sendForgotPassLinkEmail(
              foundUser.id,
              foundUser.email,
              resetPasswordCode
            );

            return new Response(JSON.stringify({ message: "Success" + res }), {
              status: 200,
            });
          } catch (error) {
            console.log("Password resetting Failed" + error);
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
  } catch (error) {
    console.log("Error processing the request:", error);
  }
}
