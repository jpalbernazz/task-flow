import { AppError } from "../../../shared/http/app-error"
import { entityToUserDTO } from "../mappers/users-mapper"
import {
  findUserById,
  updateUserAvatar,
  updateUserName,
} from "../repositories/users-repository"
import type {
  ReplaceAvatarDTO,
  ReplaceAvatarResultDTO,
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
