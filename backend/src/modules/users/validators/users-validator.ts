import { AppError } from "../../../shared/http/app-error"
import type { UpdatePasswordDTO, UpdateProfileDTO } from "../types/users-types"

interface UpdateProfileHttpInput {
  name?: string
}

interface UpdatePasswordHttpInput {
  currentPassword?: string
  newPassword?: string
}

const minimumPasswordLength = 8

export function validateUpdateProfilePayload(payload: unknown): UpdateProfileDTO {
  const data = payload as UpdateProfileHttpInput

  if (typeof data.name !== "string" || data.name.trim() === "") {
    throw new AppError(400, "name must be a non-empty string")
  }

  return {
    name: data.name.trim(),
  }
}

export function validateUpdatePasswordPayload(payload: unknown): UpdatePasswordDTO {
  const data = payload as UpdatePasswordHttpInput

  if (typeof data.currentPassword !== "string" || data.currentPassword.length < minimumPasswordLength) {
    throw new AppError(400, `currentPassword must have at least ${minimumPasswordLength} characters`)
  }

  if (typeof data.newPassword !== "string" || data.newPassword.length < minimumPasswordLength) {
    throw new AppError(400, `newPassword must have at least ${minimumPasswordLength} characters`)
  }

  return {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  }
}
