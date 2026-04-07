import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { AuthUser } from "@/lib/auth/types"
import { getCurrentUser } from "@/services/auth-service"

export interface ServerAuthContext {
  user: AuthUser
  requestHeaders: HeadersInit
}

async function getServerRequestHeaders(): Promise<HeadersInit> {
  const headerStore = await headers()
  const cookie = headerStore.get("cookie")

  if (!cookie) {
    return {}
  }

  return { cookie }
}

export async function requireServerAuth(): Promise<ServerAuthContext> {
  const requestHeaders = await getServerRequestHeaders()
  const user = await getCurrentUser({ requestHeaders })

  if (!user) {
    redirect("/login")
  }

  return {
    user,
    requestHeaders,
  }
}

export async function redirectAuthenticatedUserToDashboard(): Promise<void> {
  const requestHeaders = await getServerRequestHeaders()
  const user = await getCurrentUser({ requestHeaders })

  if (user) {
    redirect("/")
  }
}
