import { db } from "@/db/index";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/db/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { NextAuthOptions } from "next-auth";

// Auth options configuration
const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Custom error page

    verifyRequest: "/verify-email",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email || ""));
        const user = response[0];

        if (!user) throw new Error("User not found.");
        if (!user.email_verified) throw new Error("Email not verified.");

        const passwordMatch = await compare(
          credentials?.password || "",
          user.password || ""
        );
        if (!passwordMatch) throw new Error("Invalid password.");

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
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/signin`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
