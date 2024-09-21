import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    // OAuth authentication providers...

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
  secret: process.env.NEXTAUTH_SECRET, // Add this line
});

export { handler as GET, handler as POST };
