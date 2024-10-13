// route.tsx
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs"; // To hash and compare passwords
import { db } from "@/db/index"; // Drizzle ORM database instance
import { users, passwordResets } from "@/db/schema"; // Import tables
import { eq } from "drizzle-orm"; // For SQL conditions
import { getServerSession } from "next-auth"; // Import NextAuth
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

// POST: /api/reset-password
export async function POST(req: Request) {
  try {
    const { oldpassword, password } = await req.json(); // Get old and new passwords from request body
    const userId = "123";
    const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
    console.log(decision);

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    }

    // Get user session from NextAuth
    const session = await getServerSession();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(session);
    // Get the user ID from the session
    const userEmail = session.user.email;

    // Fetch the user from the database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare old password with the stored hashed password
    if (!user.password) {
      return NextResponse.json(
        { error: "User does not have a password set" },
        { status: 400 }
      );
    }

    // Compare old password with the stored hashed password
    const isOldPasswordValid = await compare(oldpassword, user.password);
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password before saving
    const hashedNewPassword = await hash(password, 10);

    // Update the password in the database
    await db
      .update(users)
      .set({ password: hashedNewPassword, updatedAt: new Date() })
      .where(eq(users.email, userEmail));

    // Store the password reset record in the password_resets table
    await db.insert(passwordResets).values({
      id: uuidv4(),
      userId: user.id,
      token: "", // Optional token field
      expiresAt: new Date(), // Set an expiration date for the reset token (optional)
      old_password: user.password, // Store the old password for record
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred. Please try again." + error },
      { status: 500 }
    );
  }
}
