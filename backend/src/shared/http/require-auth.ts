import type { NextFunction, Request, Response } from "express"
import { getAuthenticatedSession } from "../../modules/auth/services/auth-service"
import { getSessionTokenFromRequest } from "../auth/session-cookie"
import { setRequestAuth } from "./request-auth"

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const sessionToken = getSessionTokenFromRequest(req)
    const session = await getAuthenticatedSession(sessionToken)

    setRequestAuth(req, {
      userId: session.user.id,
      sessionId: session.sessionId,
    })

    return next()
  } catch (error) {
    return next(error)
  }
}
