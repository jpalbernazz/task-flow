import type { UserDTO } from "../../users/types/users-types"

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  name: string
  email: string
  password: string
}

export interface EmailPayloadDTO {
  email: string
}

export interface ResetPasswordDTO {
  token: string
  newPassword: string
}

export interface ForgotPasswordResult {
  message: string
  resetUrl: string
}

export interface SessionWithUserEntity {
  session_id: number
  session_user_id: number
  session_expires_at: Date
  user_id: number
  user_name: string
  user_email: string
  user_password_hash: string
  user_avatar_url: string | null
  user_avatar_storage_key: string | null
  user_role: "user"
  user_is_active: boolean
}

export interface PasswordResetTokenEntity {
  id: number
  user_id: number
  token_hash: string
  expires_at: Date
  used_at: Date | null
}

export interface AuthenticatedSession {
  sessionId: number
  user: UserDTO
}

export interface LoginResult {
  sessionToken: string
  user: UserDTO
}
