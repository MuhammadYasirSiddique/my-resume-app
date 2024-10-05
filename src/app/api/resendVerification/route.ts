import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Assuming db instance is already set up in your project
import { users } from "@/db/schema"; // Assuming you have users schema
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/utils/sendEmail"; // Assuming this function sends emails
import { generateCode } from "@/utils/Token"; // Assuming this generates a verification code

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate that the email was passed
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    // Fetch the user by email
    const user = await db.select().from(users).where(eq(users.email, email));

    const foundUser = user[0]; // This will give you the first result from the query.

    if (!foundUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
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

    const newVerificationCodeString = newVerificationCode.toString();
    // Update the verification code in the database
    await db
      .update(users)
      .set({ verification_token: newVerificationCodeString })
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
}
