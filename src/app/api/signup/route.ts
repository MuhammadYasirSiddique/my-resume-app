import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs"; // For hashing password if provided
import { sql } from "@vercel/postgres"; // Adjust if you're using a different database client
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"; // Adjust the path to your `authOptions` configuration
import { generateCode } from "@/utils/Token";
import { sendVerificationEmail } from "@/utils/sendEmail";

interface RequestBody {
  name: string;
  email: string;
  password?: string; // Optional for OAuth signups
  oauthProvider?: string; // Optional OAuth provider name
  oauthProviderId?: string; // Optional OAuth provider ID
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(); // Pass authOptions
  try {
    const body: RequestBody = await req.json();

    // console.log("Data received from client:", body);

    // Check if the user already exists
    const registeredUser = await sql`
      SELECT * FROM resume_users WHERE email = ${body.email}
    `;

    if (registeredUser?.rowCount ?? 0 > 0) {
      const user = registeredUser.rows[0];
      console.log("Email: - " + user.email, " already taken");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 401 }
      );
    }

    // Hash password if it's provided (for normal sign-ups)
    let hashedPassword: string | null = null;
    if (body.password) {
      hashedPassword = await hash(body.password, 10);
    }

    const verificationToken = generateCode();
    // Perform the database insertion, accounting for optional fields
    const response = await sql`
      INSERT INTO resume_users (
    name, email, password, oauth_provider, oauth_provider_id, profile_image, 
    email_verified, verification_token
  )
  VALUES (
    ${body.name}, 
    ${body.email}, 
    ${hashedPassword}, 
    ${body.oauthProvider || null}, 
    ${body.oauthProviderId || null},
    ${session?.user?.image || null},
    false,
    ${verificationToken}    
  )
  RETURNING *;
`;

    // Send verification email
    // const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;
    await sendVerificationEmail(body.email, verificationToken);

    // Respond with the inserted user data
    return NextResponse.json({
      message: "User registered. Check your email for verification.",

      data: response.rows[0], // Return the first inserted row
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return NextResponse.json(
      { message: "Error registering user" },
      { status: 400 }
    );
  }
}
