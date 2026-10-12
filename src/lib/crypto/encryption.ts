import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Returns a 32-byte Buffer encryption key.
 * Uses process.env.ENCRYPTION_SECRET_KEY, or a stable development key if unset.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET_KEY;
  if (secret && secret.length === 64) {
    return Buffer.from(secret, "hex");
  }
  if (secret && secret.length === 32) {
    return Buffer.from(secret, "utf-8");
  }
  // Deterministic local development key (32 bytes)
  return crypto.scryptSync("flowpilot-dev-master-secret", "salt-flowpilot-2026", 32);
}

export interface EncryptedData {
  iv: string; // hex
  ciphertext: string; // hex
  tag: string; // hex
}

/**
 * Encrypts a sensitive string (e.g. OAuth refresh token) using AES-256-GCM.
 */
export function encryptToken(plaintext: string): string {
  if (!plaintext) return "";
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const payload: EncryptedData = {
    iv: iv.toString("hex"),
    ciphertext: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts an AES-256-GCM payload.
 * Throws an error if ciphertext or tag was tampered with.
 */
export function decryptToken(encryptedPayload: string): string {
  if (!encryptedPayload) return "";
  try {
    const parsed: EncryptedData = JSON.parse(encryptedPayload);
    const key = getEncryptionKey();
    const iv = Buffer.from(parsed.iv, "hex");
    const ciphertext = Buffer.from(parsed.ciphertext, "hex");
    const tag = Buffer.from(parsed.tag, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    throw new Error("Failed to decrypt token: payload corrupted or unauthorized key");
  }
}
