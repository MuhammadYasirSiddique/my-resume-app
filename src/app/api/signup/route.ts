import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs"; // For hashing password if provided
import { db } from "@/db/index"; // Import your Drizzle ORM connection
import { users } from "@/db/schema"; // Import your schema
import { getServerSession } from "next-auth";
import { generateCode } from "@/utils/Token";
import { sendVerificationEmail } from "@/utils/sendEmail";
import { eq } from "drizzle-orm";

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

    // Check if the user already exists
    const registeredUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (registeredUser.length > 0) {
      const user = registeredUser[0];
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

    // Perform the database insertion, making sure all fields match their expected types
    const [newUser] = await db
      .insert(users)
      .values({
        // id: uuidv4(), // Generate a UUID for the primary key (adjust if needed
        name: body.name,
        email: body.email,
        password: hashedPassword ?? null, // Ensure password is null if not provided
        oauthProvider: body.oauthProvider || null,
        oauthProviderId: body.oauthProviderId || null,
        profileImage: session?.user?.image || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        email_verified: false,
        verification_token: verificationToken,
      })
      .returning(); // Use .returning() to return the inserted user

    // Send verification email
    await sendVerificationEmail(body.email, verificationToken);

    // Respond with the inserted user data
    return NextResponse.json({
      message: "User registered. Check your email for verification.",
      data: newUser, // Return the first inserted row
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return NextResponse.json(
      { message: "Error registering user" },
      { status: 400 }
    );
  }
}
