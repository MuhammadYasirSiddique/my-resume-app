import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import SignUpForm from "./Form";
import { createToken, removeToken } from "@/lib/sessionTokens";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export default async function Signup() {
  const session = await getServerSession();
  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Extract IP address from the request headers
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
  const reqPage = headersList.get("referer") || "/unknown-page"; // Get the referrer URL or default to "/unknown-page"

  await removeToken(ip);

  // Generate a new unique userId using uuid
  const apikeyId = uuidv4();

  // Store token in the database with userId and userIp
  const token = await createToken(apikeyId, ip, reqPage);
  // console.log("token: - ", token);
  return (
    <div>
      {/* Pass the token as a prop to the client-side form */}
      <SignUpForm token={token} />
      {/* <SignUpForm /> */}
    </div>
  );
}
