import { AppError } from "../../../shared/http/app-error"
import type {
  EmailPayloadDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from "../types/auth-types"

const minimumPasswordLength = 8

interface LoginHttpInput {
  email?: string
  password?: string
}

interface RegisterHttpInput {
  name?: string
  email?: string
  password?: string
}

interface EmailPayloadHttpInput {
  email?: string
}

interface ResetPasswordHttpInput {
  token?: string
  newPassword?: string
}

function hasValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function parseAndValidateEmail(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError(400, "email must be a valid email")
  }

  const normalizedEmail = value.trim().toLowerCase()
  if (!hasValidEmail(normalizedEmail)) {
    throw new AppError(400, "email must be a valid email")
  }

  return normalizedEmail
}

function parseAndValidatePassword(value: unknown, fieldLabel = "password"): string {
  if (typeof value !== "string" || value.length < minimumPasswordLength) {
    throw new AppError(400, `${fieldLabel} must have at least ${minimumPasswordLength} characters`)
  }

  return value
}

function parseAndValidateToken(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError(400, "token is required")
  }

  return value.trim()
}

export function validateLoginPayload(payload: unknown): LoginDTO {
  const data = payload as LoginHttpInput

  return {
    email: parseAndValidateEmail(data.email),
    password: parseAndValidatePassword(data.password),
  }
}

export function validateRegisterPayload(payload: unknown): RegisterDTO {
  const data = payload as RegisterHttpInput

  if (typeof data.name !== "string" || data.name.trim() === "") {
    throw new AppError(400, "name is required")
  }

  return {
    name: data.name.trim(),
    email: parseAndValidateEmail(data.email),
    password: parseAndValidatePassword(data.password),
  }
}

export function validateEmailPayload(payload: unknown): EmailPayloadDTO {
  const data = payload as EmailPayloadHttpInput

  return {
    email: parseAndValidateEmail(data.email),
  }
}

export function validateResetPasswordPayload(payload: unknown): ResetPasswordDTO {
  const data = payload as ResetPasswordHttpInput

  return {
    token: parseAndValidateToken(data.token),
    newPassword: parseAndValidatePassword(data.newPassword, "newPassword"),
  }
}
