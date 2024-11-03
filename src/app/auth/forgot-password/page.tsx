import React from "react";
import ForgotPasswordForm from "./Form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createToken, removeToken } from "@/lib/sessionTokens";
import { v4 as uuidv4 } from "uuid";

const ForgotPassword: React.FC = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

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
      <ForgotPasswordForm token={token} />
    </div>
  );
};

export default ForgotPassword;
