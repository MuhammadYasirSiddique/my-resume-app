import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// Users Table Schema
export const users = pgTable("resume_users", {
  id: uuid("id").primaryKey().default(`gen_random_uuid()`).notNull(), // UUID for user ID using sql
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(), // Email must be unique
  password: varchar("password", { length: 255 }), // Nullable for OAuth
  oauthProvider: varchar("oauth_provider", { length: 50 }), // OAuth provider name
  oauthProviderId: varchar("oauth_provider_id", { length: 255 }), // OAuth provider ID
  profileImage: varchar("profile_image", { length: 500 }), // Optional profile image URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()), // Automatically update timestamp
  email_verified: boolean("email_verified").default(false),
  verification_token: integer("verification_token"),
});

// Sessions Table Schema
export const sessions = pgTable("sessions", {
  sessionId: uuid("session_id")
    .primaryKey()
    .default(`gen_random_uuid()`)
    .notNull(), // Session ID using sql
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // Foreign key to users table
  accessToken: text("access_token"), // Access token for OAuth users
  refreshToken: text("refresh_token"), // Refresh token for OAuth users
  expiresAt: timestamp("expires_at"), // Token expiration time
  createdAt: timestamp("created_at").defaultNow(), // Session creation time
  lastActive: timestamp("last_active").defaultNow(), // Track last session activity
});

// OAuth Accounts Table Schema
export const oauthAccounts = pgTable("oauth_accounts", {
  id: uuid("id").primaryKey().default(`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
  provider: varchar("provider", { length: 50 }), // OAuth provider (e.g., 'google', 'github')
  providerUserId: varchar("provider_user_id", { length: 255 }), // User's ID from OAuth provider
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"), // Expiry time for OAuth tokens
  createdAt: timestamp("created_at").defaultNow(),
});

// Password Resets Table Schema
export const passwordResets = pgTable("password_resets", {
  id: uuid("id").primaryKey().default(`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
  token: varchar("token", { length: 255 }), // Secure token for password reset
  expiresAt: timestamp("expires_at"), // Token expiry time
  createdAt: timestamp("created_at").defaultNow(),
  old_password: varchar("old_password", { length: 255 }),
  tokenUsed: boolean("token_used").default(false),
});

// Database instance
export const db = drizzle(sql);

// Define types using InferSelectModel and InferInsertModel

// export type User = InferSelectModel<typeof users>;
// export type InsertUser = InferInsertModel<typeof users>;

// export type Session = InferSelectModel<typeof sessions>;
// export type InsertSession = InferInsertModel<typeof sessions>;

// export type OauthAccount = InferSelectModel<typeof oauthAccounts>;
// export type InsertOauthAccount = InferInsertModel<typeof oauthAccounts>;

// export type PasswordReset = InferSelectModel<typeof passwordResets>;
// export type InsertPasswordReset = InferInsertModel<typeof passwordResets>;

export const api_tokens = pgTable("api_tokens", {
  apikeyId: uuid("apikey_id").notNull(),
  userIp: text("user_ip").notNull(),

  apiKey: text("api_key").notNull(), // You could use this for JWT
  createdAt: timestamp("created_at").defaultNow(), // Timestamp when the token was created
  expiresAt: timestamp("expires_at").notNull(), // Expiration, 15 minutes after creation
  reqPage: text("reqpage"), // New column to store request page
});
