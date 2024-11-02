// import { db } from "@/db/index";
// import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { users } from "@/db/schema";
// import { compare } from "bcryptjs";
// import { eq } from "drizzle-orm";
// import { sql } from "@vercel/postgres";
// import { NextAuthOptions } from "next-auth";

// // import { headers } from "next/headers";
// // import { getToken } from "./sessionTokens";

// // Auth options configuration
// const authOptions: NextAuthOptions = {
//   session: { strategy: "jwt" },
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error", // Custom error page
//     // verifyRequest: "/verify-email",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//         reCaptchaToken: { label: "reCaptchaToken", type: "text" },
//         // authToken: { label: "apiKey", type: "text" },
//         // ip: { label: "ip", type: "text" },
//       },
//       authorize: async (credentials) => {
//         // const reqHeaderToken = credentials?.authToken || "";
//         try {
//           // Outer Layer: reCaptcha validation
//           const reCaptchaToken = credentials?.reCaptchaToken;
//           const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//           const reCaptchaResponse = await fetch(
//             `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchaToken}`,
//             { method: "POST" }
//           );
//           const reCaptchaVerification = await reCaptchaResponse.json();
//           console.log(
//             "reCaptcha verification response:",
//             reCaptchaVerification
//           );
//           if (!reCaptchaVerification.success) {
//             throw new Error("Invalid reCaptcha token.");
//           }

//           //   // Middle Layer: Session and API Key validation
//           // try {
//           //   const headersList = headers();
//           //   const ip =
//           //     headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
//           //   // const reqHeaderToken = headersList.get("Authorization") || "";
//           //   console.log("Header list rcvd at API: - ----" + reqHeaderToken);

//           //   const currentTime = Math.floor(Date.now());
//           //   const sessionData = await getToken(ip, reqHeaderToken);

//           //   if (!sessionData) {
//           //     throw new Error("No active session.");
//           //   }
//           //   const token = sessionData;
//           //   if (
//           //     Number(token.expiresAt) < currentTime ||
//           //     token.apiKey !== reqHeaderToken
//           //   ) {
//           //     throw new Error("Session expired or invalid API key.");
//           //   }

//           //     // Inner Layer: User verification and database insertion
//           // try {
//           const response = await db
//             .select()
//             .from(users)
//             .where(eq(users.email, credentials?.email || ""));
//           const user = response[0];

//           if (!user || !user.email_verified) {
//             console.error("User not found or email not verified.");
//             throw new Error("Email not verified.");
//           }
//           // if (!user) {
//           //   throw new Error("User not found.");
//           // }
//           // if (!user.email_verified) {
//           //   throw new Error("Email not verified.");

//           // }

//           const passwordMatch = await compare(
//             credentials?.password || "",
//             user.password || ""
//           );
//           if (!passwordMatch) {
//             throw new Error("Invalid credentials.");
//           }

//           // Successful authorization
//           return { id: user.id, name: user.name, email: user.email };
//           // } catch (dbError) {
//           //   console.error("Database operation failed:", dbError);
//           //   throw new Error("Error verifying user credentials.");
//           // }
//           // } catch (sessionError) {
//           //   console.error("Session/API Key validation failed:", sessionError);
//           //   throw new Error("Session validation failed.");
//           // }
//         } catch (reCaptchaError) {
//           console.error("reCaptcha validation failed.", reCaptchaError);
//           throw new Error("reCaptcha verification failed.");
//         }
//       },
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || "",
//       clientSecret: process.env.GITHUB_SECRET || "",
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID || "",
//       clientSecret: process.env.GOOGLE_SECRET || "",
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         if (account?.provider === "google" || account?.provider === "github") {
//           const existingUser = await db
//             .select()
//             .from(users)
//             .where(eq(users.email, user.email || ""));
//           if (existingUser.length === 0) {
//             await sql`INSERT INTO resume_users (name, email, oauth_provider, oauth_provider_id, profile_image)
//                     VALUES (${user.name}, ${user.email}, ${account.provider}, ${account.providerAccountId}, ${user.image});`;
//           }
//         }
//         return true;
//       } catch (error) {
//         console.error("Sign-in error:", error);
//         return false;
//       }
//     },
//     // async redirect({ url, baseUrl }) {
//     //   return url.startsWith(baseUrl) ? url : `${baseUrl}/signin`;
//     // },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;

import { db } from "@/db/index";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/db/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { NextAuthOptions } from "next-auth";

// Function to validate reCAPTCHA token
async function validateReCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: "POST" }
  );
  const data = await response.json();
  return data.success;
}

// async function validateSessionAndApiKey(
//   ip: string,
//   reqHeaderToken: string
// ): Promise<boolean> {
//   try {
//     const currentTime = Math.floor(Date.now());
//     const sessionData = await getToken(ip, reqHeaderToken);

//     if (!sessionData) {
//       throw new Error("No active session.");
//     }
//     const token = sessionData;
//     if (
//       Number(token.expiresAt) < currentTime ||
//       token.apiKey !== reqHeaderToken
//     ) {
//       throw new Error("Session expired or invalid API key.");
//     }

//     return true;
//   } catch (error) {
//     console.error("Session/API Key validation failed:", error);
//     return false;
//   }
// }

// Auth options configuration
const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Custom error page
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        reCaptchaToken: { label: "reCaptchaToken", type: "text" },
      },
      authorize: async (credentials) => {
        // Outer Layer: reCAPTCHA validation
        const reCaptchaToken = credentials?.reCaptchaToken;
        const isValidReCaptcha = await validateReCaptcha(reCaptchaToken!);
        // console.log("reCaptcha verification response:", isValidReCaptcha);
        if (!isValidReCaptcha) {
          throw new Error("Invalid reCAPTCHA token.");
        }

        // Verify user credentials
        const response = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email || ""));
        const user = response[0];

        if (!user) {
          throw new Error("Invalid User ID or Password.");
        }

        if (!user.email_verified) {
          throw new Error("Email not verified.");
        }

        const passwordMatch = await compare(
          credentials?.password || "",
          user.password || ""
        );
        if (!passwordMatch) {
          throw new Error("Invalid credentials.");
        }

        // Successful authorization
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email || ""));
          if (existingUser.length === 0) {
            await sql`INSERT INTO resume_users (name, email, oauth_provider, oauth_provider_id, profile_image) 
                    VALUES (${user.name}, ${user.email}, ${account.provider}, ${account.providerAccountId}, ${user.image});`;
          }
        }
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
