import type { Request } from "express"
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "./auth-config"

function parseCookieHeader(cookieHeader: string): Record<string, string> {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .reduce<Record<string, string>>((cookies, part) => {
      const separatorIndex = part.indexOf("=")
      if (separatorIndex <= 0) {
        return cookies
      }

      const key = part.slice(0, separatorIndex).trim()
      const value = part.slice(separatorIndex + 1).trim()

      if (key === "") {
        return cookies
      }

      try {
        cookies[key] = decodeURIComponent(value)
      } catch {
        cookies[key] = value
      }

      return cookies
    }, {})
}

function shouldUseSecureCookie(): boolean {
  return process.env.NODE_ENV === "production"
}

export function getSessionTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.cookie

  if (typeof cookieHeader !== "string" || cookieHeader.trim() === "") {
    return null
  }

  const cookies = parseCookieHeader(cookieHeader)
  const token = cookies[SESSION_COOKIE_NAME]

  return typeof token === "string" && token.trim() !== "" ? token : null
}

export function buildSessionCookie(sessionToken: string): string {
  const encodedToken = encodeURIComponent(sessionToken)
  const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000)

  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodedToken}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ]

  if (shouldUseSecureCookie()) {
    attributes.push("Secure")
  }

  return attributes.join("; ")
}

export function buildClearSessionCookie(): string {
  const attributes = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ]

  if (shouldUseSecureCookie()) {
    attributes.push("Secure")
  }

  return attributes.join("; ")
}
