import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Assuming db instance is already set up in your project
import { users } from "@/db/schema"; // Assuming you have users schema
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/utils/sendEmail"; // Assuming this function sends emails
import { generateCode } from "@/utils/Token"; // Assuming this generates a verification code
import aj from "@/lib/arcjet";
import { headers } from "next/headers";
import { getToken } from "@/lib/sessionTokens";

interface RequestBody {
  email: string;
  reCaptchaToken: string;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const email = body.email;

  const userId = body.email;
  const { reCaptchaToken } = body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  console.log(reCaptchaToken);

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

    try {
      const headersList = headers();
      const ip =
        headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
      const reqHeaderToken = req.headers.get("Authorization") || "";
      console.log(reqHeaderToken);
      const currentTime = Math.floor(Date.now());
      const sessionData = await getToken(ip, reqHeaderToken);

      if (!sessionData) {
        return NextResponse.json({ error: "No Session." }, { status: 403 });
      }

      const authToken = sessionData;
      const apiExpiry = Number(authToken.expiresAt);
      // console.log("TOekn Expiry from Dataabse: API ---" + apiExpiry);
      // console.log("Current Time: = API----" + currentTime);

      if (apiExpiry < currentTime || authToken.apiKey !== reqHeaderToken) {
        console.log("Token Expired. API RESPONSE");
        return NextResponse.json(
          { error: "Session expired or Invalid." },
          { status: 403 }
        );
      }

      try {
        const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
          return NextResponse.json(
            { error: "Too Many Requests", reason: decision.reason },
            { status: 429 }
          );
        }
        // Validate that the email was passed
        if (!email) {
          console.log("Email is required.");
          return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        }

        // Fetch the user by email
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const foundUser = user[0]; // This will give you the first result from the query.

        if (!foundUser) {
          return NextResponse.json(
            { message: "User not found." },
            { status: 404 }
          );
        }

        // Check if the user is already verified
        if (foundUser.email_verified) {
          return NextResponse.json(
            { message: "Email is already verified." },
            { status: 404 }
          );
        }

        // Generate a new verification code
        const newVerificationCode = generateCode();

        // Update the verification code in the database
        await db
          .update(users)
          .set({ verification_token: newVerificationCode })
          .where(eq(users.email, email));

        // Send the verification email
        await sendVerificationEmail(email, newVerificationCode);

        // Respond with success
        return NextResponse.json(
          { message: "Verification email resent successfully." },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error in resendVerification:", error);
        return NextResponse.json(
          { message: "Error resending verification email." },
          { status: 500 }
        );
      }
    } catch (error) {
      console.log("Session Validation Failed" + error);
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }
  } catch (error) {
    console.log("ReCaptcha Unsuccessful" + error);
    return NextResponse.json(
      { message: "Invalid reCaptcha Token" },
      { status: 400 }
    );
  }
}
