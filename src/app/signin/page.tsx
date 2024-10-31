import React from "react";
import SigninForm from "./Form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { createToken, removeToken } from "@/lib/sessionTokens";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

async function Signin() {
  const session = await getServerSession();
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
  // console.log("token from Page.tsx: - ", token);

  return (
    <div>
      <SigninForm token={token} />
    </div>
  );
}

export default Signin;
