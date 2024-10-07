import NextAuth from "next-auth";
import { db } from "@/db/index";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/db/schema"; // Assuming you have users schema

import { compare } from "bcryptjs";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";

const handler = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-email", // Custom page for email verification
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // const response = await sql`
        //   SELECT * FROM resume_users WHERE email = ${credentials?.email}`;
        const response = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email || ""));
        const user = response[0];
        // console.log(user);
        if (!user) {
          throw new Error("User not found.");
        }

        // Check if the email is verified (assuming email_verified is a boolean field)
        const emailVerified = user.email_verified;
        // console.log(emailVerified);

        // If the email is not verified, throw an error
        if (!emailVerified) {
          console.log(" Email not verified.");
          throw new Error("Email not verified.");
        }

        const passwordMatch = await compare(
          credentials?.password || "",
          user.password || ""
        );

        if (!passwordMatch) {
          throw new Error("Invalid password.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
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
      // console.log(user);

      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user already exists in the database
          const existingUser = await sql`
              SELECT * FROM resume_users WHERE email = ${user.email}
            `;

          if (existingUser.rowCount === 0) {
            // Insert new user into the database
            await sql`
                INSERT INTO resume_users (
    name, email, oauth_provider, oauth_provider_id, profile_image
  )
  VALUES (
    ${user?.name}, 
    ${user?.email}, 
    
    ${account.provider || null}, 
    ${account.providerAccountId || null},
    ${user?.image || null}
  )
`;
            console.log("New user added to database");
          } else {
            console.log("User already exists in database");
          }
        } catch (error) {
          console.error("Database error:", error);
          return false; // Prevent sign-in if there's a database error
        }
      }

      return true; // Allow sign-in
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
