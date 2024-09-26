import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { sql } from "@vercel/postgres";
// import NextRequest from "next/server";

const handler = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    // OAuth authentication providers...

    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log(credentials);

        const response = await sql`
        SELECT * FROM sample_users WHERE email = ${credentials?.email}`;
        const user = response.rows[0];

        if (!user) {
          throw new Error("User not found.");
        }

        const passwordMatch = await compare(
          credentials?.password || "",
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid password.");
        }

        return {
          name: user.name,
          email: user.email,
        };

        return null;
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
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER || "",
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
  ],
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     if (url.startsWith(baseUrl)) return `${baseUrl}/dashboard`;
  //     return baseUrl;
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET, // Add this line
});

export { handler as GET, handler as POST };
