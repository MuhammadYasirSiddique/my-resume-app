import { NextResponse } from "next/server";
import { db } from "@/db/index"; // Replace with your Drizzle DB import
import { users } from "@/db/schema"; // Replace with your user schema import
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// POST request to handle password reset
export async function POST(req: Request) {
  try {
    const { newPassword, userid, token } = await req.json();
    // console.log(userid);
    // Validate request
    if (!newPassword || !userid || !token) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Verify token (you would implement token verification logic here)
    const isTokenValid = await verifyToken(token, userid); // Implement this function
    if (!isTokenValid) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database using Drizzle
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userid)); // Replace with your actual user ID column

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

// Function to verify the token (you'll need to implement this logic based on your token system)
async function verifyToken(token: string, userId: string) {
  // Token verification logic here
  // Return true if valid, otherwise false
  return true;
}
