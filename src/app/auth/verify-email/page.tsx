import { getServerSession } from "next-auth";
import VerifyEmailForm from "./Form";
import { redirect } from "next/navigation";
import { createToken, removeToken } from "@/lib/sessionTokens";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const session = await getServerSession();
  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }
  // Fetch email from the query params using `searchParams`
  const email = searchParams.email || "";

  // Any other server-side data fetching can be done here
  // Extract IP address from the request headers
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
  const reqPage = headersList.get("referer") || "/unknown-page"; // Get the referrer URL or default to "/unknown-page"

  await removeToken(ip);

  // Generate a new unique userId using uuid
  const apikeyId = uuidv4();

  // Store token in the database with userId and userIp
  const authToken = await createToken(apikeyId, ip, reqPage);
  // console.log("token: - ", authToken);

  return (
    <div>
      {/* Pass the email as a prop to the client component */}
      <VerifyEmailForm email={email} authToken={authToken} />
    </div>
  );
}
