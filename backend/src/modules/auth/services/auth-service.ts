import bcrypt from "bcryptjs"
import { AppError } from "../../../shared/http/app-error"
import { RESET_PASSWORD_TTL_MS, SESSION_TTL_MS } from "../../../shared/auth/auth-config"
import { generateEmailToken, hashEmailToken } from "../../../shared/auth/email-token"
import { generateSessionToken, hashSessionToken } from "../../../shared/auth/session-token"
import { entityToUserDTO } from "../../users/mappers/users-mapper"
import {
  findUserByEmail,
  findUserById,
  insertUser,
  touchLastLoginAt,
  updateUserPasswordHash,
} from "../../users/repositories/users-repository"
import {
  consumeActiveResetTokenByHash,
  insertResetToken,
  invalidateActiveResetTokensByUserId,
} from "../repositories/password-reset-tokens-repository"
import {
  findActiveSessionWithUserByTokenHash,
  insertSession,
  revokeActiveSessionsByUserId,
  revokeSessionByTokenHash,
} from "../repositories/sessions-repository"
import type {
  AuthenticatedSession,
  EmailPayloadDTO,
  ForgotPasswordResult,
  LoginDTO,
  LoginResult,
  RegisterDTO,
  ResetPasswordDTO,
} from "../types/auth-types"

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function buildResetPath(token: string): string {
  return `/redefinir-senha?token=${encodeURIComponent(token)}`
}

export async function registerWithEmailAndPassword(input: RegisterDTO): Promise<void> {
  const normalizedEmail = normalizeEmail(input.email)
  const existingUser = await findUserByEmail(normalizedEmail)

  if (existingUser) {
    throw new AppError(409, "email já cadastrado")
  }

  const passwordHash = await bcrypt.hash(input.password, 10)
  await insertUser({
    name: input.name,
    email: normalizedEmail,
    passwordHash,
  })
}

export async function requestPasswordReset(input: EmailPayloadDTO): Promise<ForgotPasswordResult> {
  const normalizedEmail = normalizeEmail(input.email)
  const user = await findUserByEmail(normalizedEmail)

  if (!user || !user.is_active) {
    throw new AppError(404, "usuário não encontrado")
  }

  const rawToken = generateEmailToken()
  const tokenHash = hashEmailToken(rawToken)
  const expiresAt = new Date(Date.now() + RESET_PASSWORD_TTL_MS)

  await invalidateActiveResetTokensByUserId(user.id)
  await insertResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  })

  return {
    message: "Link de redefinição gerado com sucesso.",
    resetUrl: buildResetPath(rawToken),
  }
}

export async function resetPassword(input: ResetPasswordDTO): Promise<void> {
  const tokenHash = hashEmailToken(input.token)
  const consumedToken = await consumeActiveResetTokenByHash(tokenHash)

  if (!consumedToken) {
    throw new AppError(400, "token de redefinição inválido ou expirado")
  }

  const user = await findUserById(consumedToken.user_id)
  if (!user || !user.is_active) {
    throw new AppError(400, "token de redefinição inválido ou expirado")
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 10)
  await updateUserPasswordHash(user.id, passwordHash)

  await invalidateActiveResetTokensByUserId(user.id)
  await revokeActiveSessionsByUserId(user.id)
}

export async function loginWithEmailAndPassword(input: LoginDTO): Promise<LoginResult> {
  const normalizedEmail = normalizeEmail(input.email)
  const user = await findUserByEmail(normalizedEmail)

  if (!user || !user.is_active) {
    throw new AppError(401, "invalid email or password")
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password_hash)
  if (!isValidPassword) {
    throw new AppError(401, "invalid email or password")
  }

  const sessionToken = generateSessionToken()
  const sessionTokenHash = hashSessionToken(sessionToken)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await insertSession({
    userId: user.id,
    sessionTokenHash,
    expiresAt,
  })

  await touchLastLoginAt(user.id)

  return {
    sessionToken,
    user: entityToUserDTO(user),
  }
}

export async function getAuthenticatedSession(sessionToken: string | null): Promise<AuthenticatedSession> {
  if (!sessionToken) {
    throw new AppError(401, "authentication required")
  }

  const sessionTokenHash = hashSessionToken(sessionToken)
  const session = await findActiveSessionWithUserByTokenHash(sessionTokenHash)

  if (!session || !session.user_is_active) {
    throw new AppError(401, "authentication required")
  }

  return {
    sessionId: session.session_id,
    user: {
      id: session.user_id,
      name: session.user_name,
      email: session.user_email,
      avatarUrl: session.user_avatar_url,
      role: session.user_role,
    },
  }
}

export async function logoutBySessionToken(sessionToken: string | null): Promise<void> {
  if (!sessionToken) {
    return
  }

  const sessionTokenHash = hashSessionToken(sessionToken)
  await revokeSessionByTokenHash(sessionTokenHash)
}
