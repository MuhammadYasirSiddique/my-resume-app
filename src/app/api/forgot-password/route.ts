import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Assuming db instance is already set up in your project
import { passwordResets, users } from "@/db/schema"; // Assuming you have users schema
import { eq } from "drizzle-orm";
import { generateResetToken } from "@/utils/Token"; // Assuming this generates a verification code
import { sendForgotPassLinkEmail } from "@/utils/sendEmail";
import arcjet, { detectBot, tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["userId"], // track requests by a custom user ID
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 2, // refill 5 tokens per interval
      interval: 60, // refill every 10 seconds
      capacity: 5, // bucket maximum capacity of 10 tokens
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except search engine crawlers. See the full list of bots
      // for other options: https://arcjet.com/bot-list
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email } = await req.json();
    const userId = email;
    const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
    console.log(decision);

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    }

    // Validate that the email was passed
    if (!email) {
      console.log("Email is required.");
      return NextResponse.json({ message: "Bad Request " }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    const foundUser = user[0];
    // console.log(foundUser);

    if (!foundUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const resetPasswordCode = generateResetToken();
    console.log(resetPasswordCode);
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
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Error Fetching Data" + error }),
      {
        status: 500,
      }
    );
  }
}
