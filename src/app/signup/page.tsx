import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { setToken } from "../../lib/sessionCache";

import jwt from "jsonwebtoken";
import React from "react";
import SignUpForm from "./Form"; // Client Component
import { headers } from "next/headers"; // To access request headers


// Helper function to generate JWT based on IP
const generateJWT = (ip: string) => {
  const secret = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production
  // console.log(ip);
  // console.log(secret);
  return jwt.sign({ ip }, secret, { expiresIn: "1h" }); // Embed IP in the JWT payload
};

export default async function Signup() {
  const session = await getServerSession();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Extract IP address from the request headers
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";

  // Generate JWT based on the user's IP
  const token = generateJWT(ip);
  // Store token in the session cache (replace 1 with actual user ID)
  setToken(ip, token, 3600); // Expires in 1 hour

  return (
    <div>
        {/* Pass the token as a prop to the client-side form */}
        <SignUpForm token={token} />
      
    </div>
  );
}
