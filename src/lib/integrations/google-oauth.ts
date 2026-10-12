import crypto from "crypto";
import { encryptToken } from "@/lib/crypto/encryption";

export const GOOGLE_SCOPES = {
  calendar: "https://www.googleapis.com/auth/calendar.readonly",
  sheets: "https://www.googleapis.com/auth/spreadsheets",
  gmail: "https://www.googleapis.com/auth/gmail.compose",
} as const;

export type SupportedGoogleService = keyof typeof GOOGLE_SCOPES;

/**
 * Generates an HMAC-signed CSRF state parameter bound to the user's ID, service, and timestamp.
 */
export function generateOAuthState(
  userId: string,
  service: SupportedGoogleService
): string {
  const timestamp = Date.now();
  const rawState = `${userId}:${service}:${timestamp}`;
  const secret = process.env.ENCRYPTION_SECRET_KEY || "dev-state-hmac-secret";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(rawState)
    .digest("hex")
    .slice(0, 16);

  return `${rawState}:${signature}`;
}

/**
 * Validates the HMAC signature and expiration (< 10 minutes) of an OAuth state parameter.
 */
export function validateOAuthState(
  state: string,
  expectedUserId: string
): { isValid: boolean; service?: SupportedGoogleService } {
  try {
    const parts = state.split(":");
    if (parts.length !== 4) return { isValid: false };
    const [userId, service, timestampStr, signature] = parts;

    if (userId !== expectedUserId) return { isValid: false };

    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      // Expired state (> 10 minutes)
      return { isValid: false };
    }

    const secret = process.env.ENCRYPTION_SECRET_KEY || "dev-state-hmac-secret";
    const rawState = `${userId}:${service}:${timestampStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawState)
      .digest("hex")
      .slice(0, 16);

    if (signature !== expectedSignature) {
      return { isValid: false };
    }

    return {
      isValid: true,
      service: service as SupportedGoogleService,
    };
  } catch {
    return { isValid: false };
  }
}

/**
 * Builds the secure Google OAuth 2.0 Authorization URL with offline access and prompt consent.
 */
export function getGoogleAuthorizationUrl(
  userId: string,
  service: SupportedGoogleService
): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google";
  const scope = GOOGLE_SCOPES[service];
  const state = generateOAuthState(userId, service);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);

  return url.toString();
}
