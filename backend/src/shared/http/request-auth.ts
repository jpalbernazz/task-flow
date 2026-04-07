import type { Request } from "express"
import { AppError } from "./app-error"

export interface RequestAuth {
  userId: number
  sessionId: number
}

export type AuthenticatedRequest = Request & {
  auth: RequestAuth
}

export function setRequestAuth(req: Request, auth: RequestAuth): void {
  ;(req as AuthenticatedRequest).auth = auth
}

export function getRequestAuth(req: Request): RequestAuth {
  const auth = (req as AuthenticatedRequest).auth

  if (!auth) {
    throw new AppError(401, "authentication required")
  }

  return auth
}
