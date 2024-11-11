// lib/token.ts
import jwt from "jsonwebtoken";
import { db } from "@/db"; // Drizzle database instance
import { api_tokens } from "@/db/schema";
import {
  and,
  eq,
  // gt,
  lt,
} from "drizzle-orm";
import { addMinutes, subMinutes } from "date-fns";

const JWT_SECRET = process.env.JWT_SECRET!;

// Function to create a token
export async function createToken(
  apikeyId: string,
  userIp: string,
  reqPage: string
) {
  // Generate JWT
  const token = jwt.sign({ apikeyId }, JWT_SECRET, { expiresIn: "15m" });

  // Calculate expiration date
  const expiresAt = addMinutes(new Date(), 15);

  // Insert into API_tokens table
  // const tokenInserted =
  await db.insert(api_tokens).values({
    apikeyId,
    userIp,
    apiKey: token,
    createdAt: new Date(),
    expiresAt,
    reqPage, // Add reqPage here
  });
  // console.log(tokenInserted);
  return token;
}

// Function to get a token
export async function getToken(userIp: string, apiKey: string) {
  // Retrieve token from the API_tokens table if it hasn't expired
  const result = await db
    .select()
    .from(api_tokens)
    .where(
      and(
        and(eq(api_tokens.userIp, userIp), eq(api_tokens.apiKey, apiKey))
        // gt(api_tokens.expiresAt, new Date())
      )
    )
    .limit(1);
  // console.log("Received API key from cleint : - " + result[0].apiKey);
  const token = result[0];
  // console.log("Received API expire Time from Database : - " + token);
  return token;
}

// Function to remove a token
export async function removeToken(userIp: string) {
  // Calculate the time 15 minutes ago from now
  const fifteenMinutesAgo = subMinutes(new Date(), 15);

  // Delete tokens where userIp matches and createdAt is older than 15 minutes
  await db
    .delete(api_tokens)
    .where(
      and(
        eq(api_tokens.userIp, userIp),
        lt(api_tokens.createdAt, fifteenMinutesAgo)
      )
    );
}
