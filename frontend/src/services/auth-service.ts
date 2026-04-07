import type { AuthUser } from "@/lib/auth/types"
import { apiFetch, resolveApiUrl, throwApiError, type ApiRequestContext } from "@/services/api-client"

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface EmailInput {
  email: string
}

interface ResetPasswordInput {
  token: string
  newPassword: string
}

interface AuthResponse {
  user: AuthUser
}

interface MessageResponse {
  message: string
}

export interface ForgotPasswordResponse extends MessageResponse {
  resetUrl: string
}

interface UpdateProfileInput {
  name: string
}

function withAbsoluteAvatarUrl(user: AuthUser): AuthUser {
  if (!user.avatarUrl) {
    return user
  }

  if (user.avatarUrl.startsWith("http://") || user.avatarUrl.startsWith("https://")) {
    return user
  }

  return {
    ...user,
    avatarUrl: resolveApiUrl(user.avatarUrl),
  }
}

export async function registerAccount(input: RegisterInput): Promise<string> {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível criar a conta.")
  }

  const data = (await response.json()) as MessageResponse
  return data.message
}

export async function requestPasswordReset(input: EmailInput): Promise<ForgotPasswordResponse> {
  const response = await apiFetch("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível iniciar a recuperação de senha.")
  }

  return (await response.json()) as ForgotPasswordResponse
}

export async function confirmResetPassword(input: ResetPasswordInput): Promise<string> {
  const response = await apiFetch("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível redefinir a senha.")
  }

  const data = (await response.json()) as MessageResponse
  return data.message
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível fazer login.")
  }

  const data = (await response.json()) as AuthResponse
  return withAbsoluteAvatarUrl(data.user)
}

export async function logout(): Promise<void> {
  const response = await apiFetch("/auth/logout", {
    method: "POST",
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível finalizar sua sessão.")
  }
}

export async function getCurrentUser(context: ApiRequestContext = {}): Promise<AuthUser | null> {
  const response = await apiFetch("/auth/me", {
    method: "GET",
    cache: "no-store",
    requestHeaders: context.requestHeaders,
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    await throwApiError(response, "Não foi possível carregar os dados da sessão.")
  }

  const data = (await response.json()) as AuthResponse
  return withAbsoluteAvatarUrl(data.user)
}

export async function updateMyProfile(input: UpdateProfileInput): Promise<AuthUser> {
  const response = await apiFetch("/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível atualizar seu perfil.")
  }

  const data = (await response.json()) as AuthResponse
  return withAbsoluteAvatarUrl(data.user)
}

export async function uploadMyAvatar(file: File): Promise<AuthUser> {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await apiFetch("/users/me/avatar", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    await throwApiError(response, "Não foi possível atualizar seu avatar.")
  }

  const data = (await response.json()) as AuthResponse
  return withAbsoluteAvatarUrl(data.user)
}
