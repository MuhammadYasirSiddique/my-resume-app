import { getToken } from "./sessionTokens";
import { headers } from "next/headers";

export async function validateSessionAndApiKey(
  authToken: string
): Promise<boolean> {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
  try {
    const currentTime = Math.floor(Date.now());
    const sessionData = await getToken(ip, authToken);

    if (!sessionData) {
      throw new Error("No active session.");
    }
    const token = sessionData;
    if (Number(token.expiresAt) < currentTime || token.apiKey !== authToken) {
      throw new Error("Session expired or invalid API key.");
    }

    return true;
  } catch (error) {
    console.error("Session/API Key validation failed:", error);
    return false;
  }
}
