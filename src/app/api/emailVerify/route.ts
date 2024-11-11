import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm"; // Import necessary query helpers
import { db } from "@/db/index"; // Import your drizzle PostgreSQL instance
import { users } from "@/db/schema"; // Import your users table schema
import aj from "@/lib/arcjet";

import { validateReCaptcha } from "@/lib/reCaptcha";
import { validateSessionAndApiKey } from "@/lib/apiKeyValidation";
interface RequestBody {
  email: string;
  token: string;
  reCaptchaToken: string;
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json();

  const { reCaptchaToken } = body;

  try {
    const reCaptchaVerification = await validateReCaptcha(reCaptchaToken);

    if (!reCaptchaVerification) {
      return NextResponse.json(
        { message: "Invalid reCaptcha Token" },
        { status: 400 }
      );
    }

    try {
      const reqHeaderToken = req.headers.get("Authorization") || "";

      const sessionData = await validateSessionAndApiKey(reqHeaderToken);

      if (!sessionData) {
        return NextResponse.json(
          { error: "Session expired or Invalid.." },
          { status: 403 }
        );
      }

      try {
        const { email, token } = body; // Parse the request body for email and token
        const userId = email;

        const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
          return NextResponse.json(
            { error: "Too Many Requests", reason: decision.reason },
            { status: 429 }
          );
        }

        // Check if both email and token are provided
        if (!email || !token) {
          console.log("Email or token is missing");
          return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        }

        // Query the database to find the user with the provided email and token
        const user = await db
          .select()
          .from(users)
          .where(
            and(
              eq(users.email, email),
              eq(users.verification_token, Number(token))
            )
          )
          .limit(1);

        // If user is not found or token doesn't match
        if (user.length === 0) {
          console.log("Token invalid or expired");

          return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        }

        // If the user is found, update the `email_verified` status and reset the token
        await db
          .update(users)
          .set({
            email_verified: true,
            verification_token: null,
          })
          .where(eq(users.email, email));

        return NextResponse.json(
          { message: "Email verified successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.log("Too many requests" + error);
        return NextResponse.json(
          { message: "Too Many Requests" },
          { status: 429 }
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
