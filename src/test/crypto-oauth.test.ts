import { describe, it, expect } from "vitest";
import { encryptToken, decryptToken } from "@/lib/crypto/encryption";
import {
  generateOAuthState,
  validateOAuthState,
  GOOGLE_SCOPES,
} from "@/lib/integrations/google-oauth";

describe("Module 5: Cryptography & Google OAuth Security", () => {
  describe("AES-256-GCM Token Encryption", () => {
    it("successfully encrypts and decrypts a sensitive refresh token", () => {
      const sensitiveToken = "1//04test_refresh_token_very_secret_xyz123";
      const encrypted = encryptToken(sensitiveToken);

      expect(encrypted).not.toContain(sensitiveToken);
      const parsed = JSON.parse(encrypted);
      expect(parsed.iv).toBeDefined();
      expect(parsed.ciphertext).toBeDefined();
      expect(parsed.tag).toBeDefined();

      const decrypted = decryptToken(encrypted);
      expect(decrypted).toBe(sensitiveToken);
    });

    it("rejects tampered ciphertext (authenticated encryption verification)", () => {
      const sensitiveToken = "test_token";
      const encrypted = encryptToken(sensitiveToken);
      const parsed = JSON.parse(encrypted);

      // Tamper with ciphertext by modifying the first characters
      parsed.ciphertext = "0000" + parsed.ciphertext.slice(4);
      const tampered = JSON.stringify(parsed);

      expect(() => decryptToken(tampered)).toThrow(/Failed to decrypt/);
    });

    it("rejects tampered authentication tag", () => {
      const sensitiveToken = "test_token";
      const encrypted = encryptToken(sensitiveToken);
      const parsed = JSON.parse(encrypted);

      // Tamper with authentication tag
      parsed.tag = "ff" + parsed.tag.slice(2);
      const tampered = JSON.stringify(parsed);

      expect(() => decryptToken(tampered)).toThrow(/Failed to decrypt/);
    });
  });

  describe("Google OAuth CSRF State Validation", () => {
    const testUserId = "user-12345";

    it("generates and validates an authentic HMAC-signed state parameter", () => {
      const state = generateOAuthState(testUserId, "calendar");
      const validation = validateOAuthState(state, testUserId);

      expect(validation.isValid).toBe(true);
      expect(validation.service).toBe("calendar");
    });

    it("rejects state when expected user ID does not match (cross-user attack prevention)", () => {
      const state = generateOAuthState(testUserId, "sheets");
      const validation = validateOAuthState(state, "attacker-user-id");

      expect(validation.isValid).toBe(false);
    });

    it("rejects state with forged signature", () => {
      const state = generateOAuthState(testUserId, "gmail");
      const parts = state.split(":");
      parts[3] = "forged_signature_00";
      const forgedState = parts.join(":");

      const validation = validateOAuthState(forgedState, testUserId);
      expect(validation.isValid).toBe(false);
    });
  });

  describe("Least-Privilege Scopes Verification", () => {
    it("enforces read-only calendar scope", () => {
      expect(GOOGLE_SCOPES.calendar).toBe(
        "https://www.googleapis.com/auth/calendar.readonly"
      );
    });

    it("enforces compose-only Gmail scope (restricting autonomous send)", () => {
      expect(GOOGLE_SCOPES.gmail).toBe(
        "https://www.googleapis.com/auth/gmail.compose"
      );
      expect(GOOGLE_SCOPES.gmail).not.toContain("gmail.send");
      expect(GOOGLE_SCOPES.gmail).not.toBe("https://mail.google.com/");
    });
  });
});
