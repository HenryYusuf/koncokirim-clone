import { expo } from "@better-auth/expo";
import { createDb } from "@koncokirim-app/db";
import * as schema from "@koncokirim-app/db/schema/auth";
import { env } from "@koncokirim-app/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { z } from "zod";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",

      schema: schema,
    }),
    trustedOrigins: [
      env.CORS_ORIGIN,
      "koncokirim-app://",
      ...(env.NODE_ENV === "development"
        ? ["exp://", "exp://**", "exp://192.168.*.*:*/**", "http://localhost:8081"]
        : []),
    ],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "CUSTOMER",
          input: false, // Prevent client-side override (Privilege Escalation Fix)
        },
        phoneNumber: {
          type: "string",
          required: false,
          validator: {
            input: z.string().regex(/^(08|\+628)\d{8,12}$/, "Format nomor WhatsApp tidak valid"),
          },
        },
      },
      changeEmail: {
        enabled: true
      }
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        // Log removed for security (Sensitive Data in Logs Fix)
      },
    },
    plugins: [expo()],
  });
}

export const auth = createAuth();
