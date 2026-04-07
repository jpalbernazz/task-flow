import type { Request, Response } from "express"
import {
  buildClearSessionCookie,
  buildSessionCookie,
  getSessionTokenFromRequest,
} from "../../../shared/auth/session-cookie"
import {
  getAuthenticatedSession,
  loginWithEmailAndPassword,
  logoutBySessionToken,
  registerWithEmailAndPassword,
  requestPasswordReset,
  resetPassword,
} from "../services/auth-service"
import {
  validateEmailPayload,
  validateLoginPayload,
  validateRegisterPayload,
  validateResetPasswordPayload,
} from "../validators/auth-validator"

export async function register(req: Request, res: Response) {
  const input = validateRegisterPayload(req.body)
  await registerWithEmailAndPassword(input)
  console.info(`[auth] register success email=${input.email} ip=${req.ip}`)

  return res.status(201).json({
    message: "Conta criada com sucesso. Você já pode fazer login.",
  })
}

export async function login(req: Request, res: Response) {
  const input = validateLoginPayload(req.body)
  const { sessionToken, user } = await loginWithEmailAndPassword(input)
  console.info(`[auth] login success userId=${user.id} email=${user.email} ip=${req.ip}`)

  res.setHeader("Set-Cookie", buildSessionCookie(sessionToken))
  return res.status(200).json({ user })
}

export async function logout(req: Request, res: Response) {
  const sessionToken = getSessionTokenFromRequest(req)
  await logoutBySessionToken(sessionToken)
  console.info(`[auth] logout success hasSession=${sessionToken ? "yes" : "no"} ip=${req.ip}`)

  res.setHeader("Set-Cookie", buildClearSessionCookie())
  return res.status(204).send()
}

export async function me(req: Request, res: Response) {
  const sessionToken = getSessionTokenFromRequest(req)
  const session = await getAuthenticatedSession(sessionToken)

  return res.status(200).json({ user: session.user })
}

export async function forgotPassword(req: Request, res: Response) {
  const input = validateEmailPayload(req.body)
  const result = await requestPasswordReset(input)
  console.info(`[auth] forgot-password success email=${input.email} ip=${req.ip}`)

  return res.status(200).json(result)
}

export async function confirmResetPassword(req: Request, res: Response) {
  const input = validateResetPasswordPayload(req.body)
  await resetPassword(input)
  console.info(`[auth] reset-password success ip=${req.ip}`)

  return res.status(200).json({ message: "Senha redefinida com sucesso." })
}
