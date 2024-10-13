import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Replace with your Drizzle DB import
import { passwordResets, users } from "@/db/schema"; // Replace with your user schema import
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
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

export async function POST(req: NextRequest) {
  try {
    const { password, userid, token } = await req.json();

    const userId = userid;

    const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    }

    // Validate request
    if (!password || !userid || !token) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Verify token
    const tokenStatus = await verifyToken(token, userid);

    // Handle token verification result
    if (tokenStatus === "invalid") {
      return NextResponse.json(
        { error: "Invalid token or user ID" },
        { status: 401 }
      );
    } else if (tokenStatus === "expired") {
      return NextResponse.json({ error: "Token has expired" }, { status: 401 });
    } else if (tokenStatus === "used") {
      return NextResponse.json(
        { error: "Token is already used" },
        { status: 401 }
      );
    } else if (tokenStatus === "error") {
      return NextResponse.json(
        { error: "Error verifying token" },
        { status: 500 }
      );
    }

    // If token is valid, proceed with password reset
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userid)); // Replace with actual user ID column

    // Mark token as used
    await db
      .update(passwordResets)
      .set({ tokenUsed: true })
      .where(
        and(eq(passwordResets.userId, userid), eq(passwordResets.token, token))
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

async function verifyToken(token: string, userid: string) {
  try {
    const resetRecord = await db
      .select()
      .from(passwordResets)
      .where(
        and(eq(passwordResets.userId, userid), eq(passwordResets.token, token))
      )
      .execute();

    if (resetRecord.length === 0) {
      return "invalid"; // Return invalid token or user ID
    }

    const resetData = resetRecord[0];
    const currentTime = new Date();

    if (!resetData.expiresAt || resetData.expiresAt < currentTime) {
      return "expired"; // Return expired token
    }

    if (resetData.tokenUsed) {
      return "used"; // Return already used token
    }

    return true; // Token is valid
  } catch (error) {
    console.log("Error verifying token:", error);
    return "error"; // Return generic error
  }
}
