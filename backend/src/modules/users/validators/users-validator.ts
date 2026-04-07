import { AppError } from "../../../shared/http/app-error"
import type { UpdateProfileDTO } from "../types/users-types"

interface UpdateProfileHttpInput {
  name?: string
}

export function validateUpdateProfilePayload(payload: unknown): UpdateProfileDTO {
  const data = payload as UpdateProfileHttpInput

  if (typeof data.name !== "string" || data.name.trim() === "") {
    throw new AppError(400, "name must be a non-empty string")
  }

  return {
    name: data.name.trim(),
  }
}
