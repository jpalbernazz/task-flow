import { createHash, randomBytes } from "node:crypto"

export function generateEmailToken(): string {
  return randomBytes(48).toString("base64url")
}

export function hashEmailToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
