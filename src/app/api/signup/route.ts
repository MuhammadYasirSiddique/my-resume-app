// import { NextRequest, NextResponse } from "next/server";
// import { hash } from "bcryptjs"; // For hashing password if provided
// import { db } from "@/db/index"; // Import your Drizzle ORM connection
// import { users } from "@/db/schema"; // Import your schema
// import { getServerSession } from "next-auth";
// import { generateCode } from "@/utils/Token";
// import { sendVerificationEmail } from "@/utils/sendEmail";
// import { eq } from "drizzle-orm";
// import arcjet, { detectBot, tokenBucket } from "@arcjet/next";
// import { getToken } from "@/lib/sessionCache"; // Import session cache helpers
// import { headers } from "next/headers";

// const aj = arcjet({
//   key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
//   characteristics: ["userId"], // track requests by a custom user ID
//   rules: [
//     // Create a token bucket rate limit. Other algorithms are supported.
//     tokenBucket({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       refillRate: 2, // refill 5 tokens per interval
//       interval: 60, // refill every 10 seconds
//       capacity: 5, // bucket maximum capacity of 10 tokens
//     }),
//     detectBot({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       // Block all bots except search engine crawlers. See the full list of bots
//       // for other options: https://arcjet.com/bot-list
//       allow: ["CATEGORY:SEARCH_ENGINE"],
//     }),
//   ],
// });

// interface RequestBody {
//   name: string;
//   email: string;
//   password?: string; // Optional for OAuth signups
//   oauthProvider?: string; // Optional OAuth provider name
//   oauthProviderId?: string; // Optional OAuth provider ID
// }

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(); // Pass authOptions
//   try {
//     const body: RequestBody = await req.json();
//     const userId = body.email;

//     const headersList = headers();
//     const ip =
//       headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
//     const reqHeaderToken = req.headers.get("Authorization");
//     const currentTime = Math.floor(Date.now()); // Current time in seconds
//     const sessionData = getToken(ip); // Get the session data.

//     const decision = await aj.protect(req, { userId, requested: 1 }); // Deduct 5 tokens from the bucket
//     // console.log("Arcjet decision", decision);

//     if (decision.isDenied()) {
//       return NextResponse.json(
//         { error: "Too Many Requests." },
//         { status: 429 }
//       );
//     }

//     if (decision.isAllowed()) {
//       if (!sessionData) {
//         return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
//       }

//       const { token: cachedToken, expirationTime } = sessionData;

//       if (expirationTime < currentTime) {
//         console.log("JWT Expired");
//         return NextResponse.json(
//           { error: "Session expired." },
//           { status: 440 }
//         );
//       }

//       if (cachedToken !== reqHeaderToken) {
//         return NextResponse.json(
//           { error: "Invalid Credentials." },
//           { status: 403 }
//         );
//       }
//     }
//     // Check if the user already exists
//     const registeredUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, body.email));

//     if (registeredUser.length > 0) {
//       const user = registeredUser[0];
//       console.log(user);
//       console.log("Email: - " + user.email, " already taken");
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 409 }
//       );
//     }

//     // Hash password if it's provided (for normal sign-ups)
//     let hashedPassword: string | null = null;
//     if (body.password) {
//       hashedPassword = await hash(body.password, 10);
//     }

//     const verificationToken = generateCode();

//     // Perform the database insertion, making sure all fields match their expected types
//     const [newUser] = await db
//       .insert(users)
//       .values({
//         // id: uuidv4(), // Generate a UUID for the primary key (adjust if needed
//         name: body.name,
//         email: body.email,
//         password: hashedPassword ?? null, // Ensure password is null if not provided
//         oauthProvider: body.oauthProvider || null,
//         oauthProviderId: body.oauthProviderId || null,
//         profileImage: session?.user?.image || null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         email_verified: false,
//         verification_token: verificationToken,
//       })
//       .returning(); // Use .returning() to return the inserted user

//     // Send verification email
//     await sendVerificationEmail(body.email, verificationToken);

//     // Respond with the inserted user data
//     return NextResponse.json({
//       message: "User registered. Check your email for verification.",
//       data: newUser, // Return the first inserted row
//     });
//   } catch (error) {
//     console.error("Error processing the request:", error);

//     return NextResponse.json(
//       { message: "Error registering user" },
//       { status: 400 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { hash } from "bcryptjs"; // For hashing password if provided
// import { db } from "@/db/index"; // Import your Drizzle ORM connection
// import { users } from "@/db/schema"; // Import your schema
// import { getServerSession } from "next-auth";
// import { generateCode } from "@/utils/Token";
// import { sendVerificationEmail } from "@/utils/sendEmail";
// import { eq } from "drizzle-orm";
// import arcjet, { detectBot, tokenBucket } from "@arcjet/next";
// import { getToken } from "@/lib/sessionCache"; // Import session cache helpers
// import { headers } from "next/headers";

// const aj = arcjet({
//   key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
//   characteristics: ["userId"], // track requests by a custom user ID
//   rules: [
//     // Create a token bucket rate limit. Other algorithms are supported.
//     tokenBucket({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       refillRate: 2, // refill 5 tokens per interval
//       interval: 60, // refill every 10 seconds
//       capacity: 5, // bucket maximum capacity of 10 tokens
//     }),
//     detectBot({
//       mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       // Block all bots except search engine crawlers. See the full list of bots
//       // for other options: https://arcjet.com/bot-list
//       allow: ["CATEGORY:SEARCH_ENGINE"],
//     }),
//   ],
// });

// interface RequestBody {
//   name: string;
//   email: string;
//   password?: string; // Optional for OAuth signups
//   oauthProvider?: string; // Optional OAuth provider name
//   oauthProviderId?: string; // Optional OAuth provider ID
//   reCaptchaToken: string;
// }

// export async function POST(req: NextRequest) {
//   const session = await getServerSession();

//   try {
//     const body: RequestBody = await req.json();
//     const userId = body.email;
//     const { reCaptchaToken } = body;
//     const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;
//     try {
//       const reCpatchaVerficationResponse = await fetch(
//         `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchaToken}`,
//         {
//           method: "POST",
//         }
//       );
//       const reCpatchaVerfication = await reCpatchaVerficationResponse.json();
//       if (reCpatchaVerfication.success) {
//         console.log(
//           "ReCaptcha found., with score: - " + reCpatchaVerfication.score
//         );
//       } else {
//         console.log("No Recaptcha");
//         return NextResponse.json(
//           { message: "Invalid reCaptcha Token" },
//           { status: 400 }
//         );
//       }
//     } catch {
//       console.log("No Recaptcha");
//       return NextResponse.json(
//         { message: "Invalid reCaptcha Token" },
//         { status: 400 }
//       );
//     }

//     // --- Rate Limit Check ---

//     try {
//       const decision = await aj.protect(req, { userId, requested: 1 });
//       if (decision.isDenied()) {
//         return NextResponse.json(
//           { error: "Too Many Requests." },
//           { status: 429 }
//         );
//       }
//     } catch (rateLimitError) {
//       console.error("Rate limiting failed:", rateLimitError);
//       return NextResponse.json(
//         { message: "Something Went Wrong." },
//         { status: 500 }
//       );
//     }

//     // --- Session Cache Handling ---
//     try {
//       const headersList = headers();
//       const ip =
//         headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
//       const reqHeaderToken = req.headers.get("Authorization");
//       const currentTime = Math.floor(Date.now() / 1000) - 6000; // Current time in seconds
//       const sessionData = getToken(ip);

//       if (!sessionData) {
//         return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
//       }

//       const { token: cachedToken, expirationTime } = sessionData;

//       if (expirationTime < currentTime) {
//         console.log("JWT Expired");
//         return NextResponse.json(
//           { error: "Session expired." },
//           { status: 440 }
//         );
//       }

//       if (cachedToken !== reqHeaderToken) {
//         console.log("Invalid JWT token");
//         return NextResponse.json(
//           { error: "Invalid Credentials." },
//           { status: 403 }
//         );
//       }
//     } catch (sessionError) {
//       console.error("Session handling failed:", sessionError);
//       return NextResponse.json(
//         { message: "Session validation failed." },
//         { status: 500 }
//       );
//     }

//     // --- Database Check & Insertion ---
//     try {
//       // Check if the user already exists
//       const registeredUser = await db
//         .select()
//         .from(users)
//         .where(eq(users.email, body.email));

//       if (registeredUser.length > 0) {
//         return NextResponse.json(
//           { message: "User already exists" },
//           { status: 409 }
//         );
//       }

//       // Hash password if it's provided
//       let hashedPassword: string | null = null;
//       if (body.password) {
//         hashedPassword = await hash(body.password, 10);
//       }

//       const verificationToken = generateCode();

//       // Insert user into database
//       const [newUser] = await db
//         .insert(users)
//         .values({
//           name: body.name,
//           email: body.email,
//           password: hashedPassword ?? null,
//           oauthProvider: body.oauthProvider || null,
//           oauthProviderId: body.oauthProviderId || null,
//           profileImage: session?.user?.image || null,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           email_verified: false,
//           verification_token: verificationToken,
//         })
//         .returning();
//       console.log(newUser);
//       // --- Email Sending ---
//       try {
//         await sendVerificationEmail(body.email, verificationToken);
//       } catch (emailError) {
//         console.error("Failed to send verification email:", emailError);
//         return NextResponse.json(
//           { message: "User registered but email sending failed." },
//           { status: 500 }
//         );
//       }

//       // Respond with success if everything went fine
//       return NextResponse.json({
//         message: "User registered. Check your email for verification.",
//         // data: newUser,
//       });
//     } catch (dbError) {
//       console.error("Database error:", dbError);
//       return NextResponse.json(
//         { message: "Error registering user." },
//         { status: 500 }
//       );
//     }
//   } catch (generalError) {
//     console.error("Error processing the request:", generalError);
//     return NextResponse.json(
//       { message: "Invalid request body" },
//       { status: 400 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { getServerSession } from "next-auth";
import { generateCode } from "@/utils/Token";
import { sendVerificationEmail } from "@/utils/sendEmail";
import { eq } from "drizzle-orm";
import arcjet, { detectBot, tokenBucket } from "@arcjet/next";
import { getToken } from "@/lib/sessionCache";
import { headers } from "next/headers";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 2,
      interval: 60,
      capacity: 5,
    }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

interface RequestBody {
  name: string;
  email: string;
  password?: string;
  oauthProvider?: string;
  oauthProviderId?: string;
  reCaptchaToken: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  try {
    const body: RequestBody = await req.json();
    const userId = body.email;
    const { reCaptchaToken } = body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // reCaptcha validation
    try {
      const reCaptchaVerificationResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchaToken}`,
        { method: "POST" }
      );
      const reCaptchaVerification = await reCaptchaVerificationResponse.json();

      if (!reCaptchaVerification.success) {
        return NextResponse.json(
          { message: "Invalid reCaptcha Token" },
          { status: 400 }
        );
      }

      // Session and JWT verification
      try {
        const headersList = headers();
        const ip =
          headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
        const reqHeaderToken = req.headers.get("Authorization");
        const currentTime = Math.floor(Date.now() / 1000) - 6000;
        const sessionData = getToken(ip);

        if (!sessionData) {
          return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const { token: cachedToken, expirationTime } = sessionData;

        if (expirationTime < currentTime) {
          return NextResponse.json(
            { error: "Session expired." },
            { status: 440 }
          );
        }

        if (cachedToken !== reqHeaderToken) {
          return NextResponse.json(
            { error: "Invalid Credentials." },
            { status: 403 }
          );
        }

        // Rate limiting
        try {
          const decision = await aj.protect(req, { userId, requested: 1 });
          if (decision.isDenied()) {
            return NextResponse.json(
              { error: "Too Many Requests." },
              { status: 429 }
            );
          }

          // Database check and insertion
          try {
            const registeredUser = await db
              .select()
              .from(users)
              .where(eq(users.email, body.email));
            console.log(registeredUser);
            if (registeredUser.length > 0) {
              return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
              );
            }

            let hashedPassword: string | null = null;
            if (body.password) {
              hashedPassword = await hash(body.password, 10);
            }

            const verificationToken = generateCode();
            const [newUser] = await db
              .insert(users)
              .values({
                name: body.name,
                email: body.email,
                password: hashedPassword ?? null,
                oauthProvider: body.oauthProvider || null,
                oauthProviderId: body.oauthProviderId || null,
                profileImage: session?.user?.image || null,
                createdAt: new Date(),
                updatedAt: new Date(),
                email_verified: false,
                verification_token: verificationToken,
              })
              .returning();
            console.log(newUser);

            // Email verification
            try {
              await sendVerificationEmail(body.email, verificationToken);
              return NextResponse.json({
                message: "User registered. Check your email for verification.",
              });
            } catch (emailError) {
              console.error("Failed to send verification email:", emailError);
              return NextResponse.json(
                { message: "User registered but email sending failed." },
                { status: 500 }
              );
            }
          } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
              { message: "Error registering user." },
              { status: 500 }
            );
          }
        } catch (rateLimitError) {
          console.error("Rate limiting failed:", rateLimitError);
          return NextResponse.json(
            { message: "Something went wrong." },
            { status: 500 }
          );
        }
      } catch (sessionError) {
        console.error("Session handling failed:", sessionError);
        return NextResponse.json(
          { message: "Session validation failed." },
          { status: 500 }
        );
      }
    } catch {
      return NextResponse.json(
        { message: "Invalid reCaptcha Token" },
        { status: 400 }
      );
    }
  } catch (generalError) {
    console.error("Error processing the request:", generalError);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}
