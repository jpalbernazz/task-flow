import bcrypt from "bcryptjs"
import { AppError } from "../../../shared/http/app-error"
import { revokeOtherActiveSessionsByUserId } from "../../auth/repositories/sessions-repository"
import { entityToUserDTO } from "../mappers/users-mapper"
import {
  findUserById,
  updateUserAvatar,
  updateUserName,
  updateUserPasswordHash,
} from "../repositories/users-repository"
import type {
  ReplaceAvatarDTO,
  ReplaceAvatarResultDTO,
  UpdatePasswordDTO,
  UpdateProfileDTO,
  UserDTO,
} from "../types/users-types"

export async function updateUserProfileById(userId: number, input: UpdateProfileDTO): Promise<UserDTO> {
  const updatedUser = await updateUserName(userId, input.name)

  if (!updatedUser || !updatedUser.is_active) {
    throw new AppError(404, "user not found")
  }

  return entityToUserDTO(updatedUser)
}

export async function replaceUserAvatarById(
  userId: number,
  input: ReplaceAvatarDTO,
): Promise<ReplaceAvatarResultDTO> {
  const currentUser = await findUserById(userId)

  if (!currentUser || !currentUser.is_active) {
    throw new AppError(404, "user not found")
  }

  const updatedUser = await updateUserAvatar(userId, input.avatarUrl, input.avatarStorageKey)

  if (!updatedUser || !updatedUser.is_active) {
    throw new AppError(404, "user not found")
  }

  return {
    user: entityToUserDTO(updatedUser),
    previousAvatarStorageKey: currentUser.avatar_storage_key,
  }
}

export async function updateUserPasswordById(
  userId: number,
  input: UpdatePasswordDTO,
  currentSessionId: number,
): Promise<void> {
  if (!Number.isInteger(currentSessionId) || currentSessionId <= 0) {
    throw new AppError(401, "authentication required")
  }

  const user = await findUserById(userId)

  if (!user || !user.is_active) {
    throw new AppError(404, "user not found")
  }

  const isCurrentPasswordValid = await bcrypt.compare(input.currentPassword, user.password_hash)

  if (!isCurrentPasswordValid) {
    throw new AppError(403, "current password is invalid")
  }

  const newPasswordHash = await bcrypt.hash(input.newPassword, 10)
  await updateUserPasswordHash(userId, newPasswordHash)
  await revokeOtherActiveSessionsByUserId(userId, currentSessionId)
}
