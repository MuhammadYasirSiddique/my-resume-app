import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index"; // Assuming db instance is already set up in your project
import { passwordResets, users } from "@/db/schema"; // Assuming you have users schema
import { eq } from "drizzle-orm";
import { generateResetToken } from "@/utils/Token"; // Assuming this generates a verification code
import { sendForgotPassLinkEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email } = await req.json();
    // console.log(email);

    // Validate that the email was passed
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    const foundUser = user[0];
    console.log(foundUser);

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

// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     // Get email from query parameters
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");

//     console.log(email);

//     return new Response(JSON.stringify({ message: "Success", email }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.log(error);
//     return new Response(JSON.stringify({ message: "Error" + error }), {
//       status: 500,
//     });
//   }
// }
