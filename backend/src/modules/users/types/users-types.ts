export type UserRole = "user"

export interface UserEntity {
  id: number
  name: string
  email: string
  password_hash: string
  avatar_url: string | null
  avatar_storage_key: string | null
  role: UserRole
  is_active: boolean
  last_login_at: Date | null
}

export interface UserDTO {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: UserRole
}

export interface CreateUserDTO {
  name: string
  email: string
  passwordHash: string
}

export interface UpdateProfileDTO {
  name: string
}

export interface UpdatePasswordDTO {
  currentPassword: string
  newPassword: string
}

export interface ReplaceAvatarDTO {
  avatarUrl: string
  avatarStorageKey: string
}

export interface ReplaceAvatarResultDTO {
  user: UserDTO
  previousAvatarStorageKey: string | null
}
