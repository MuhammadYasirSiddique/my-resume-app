import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm"; // Import necessary query helpers
import { db } from "@/db/index"; // Import your drizzle PostgreSQL instance
import { users } from "@/db/schema"; // Import your users table schema
import arcjet, { detectBot, tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["userId"], // track requests by a custom user ID
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 3, // refill 5 tokens per interval
      interval: 60, // refill every 10 seconds
      capacity: 6, // bucket maximum capacity of 10 tokens
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except search engine crawlers. See the full list of bots
      // for other options: https://arcjet.com/bot-list
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json(); // Parse the request body for email and token
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
      return NextResponse.json(
        { message: "Email or token is missing" },
        { status: 400 }
      );
    }

    // Query the database to find the user with the provided email and token
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.verification_token, token)))
      .limit(1);

    // If user is not found or token doesn't match
    if (user.length === 0) {
      return NextResponse.json(
        { message: "Token invalid or expired" },
        { status: 400 }
      );
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
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
