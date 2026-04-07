import { unlink } from "node:fs/promises"
import path from "node:path"
import type { Request, Response } from "express"
import { AVATAR_UPLOADS_DIR } from "../../../shared/auth/auth-config"
import { AppError } from "../../../shared/http/app-error"
import { getRequestAuth } from "../../../shared/http/request-auth"
import { replaceUserAvatarById, updateUserPasswordById, updateUserProfileById } from "../services/users-service"
import { validateUpdatePasswordPayload, validateUpdateProfilePayload } from "../validators/users-validator"

async function removeOldAvatar(storageKey: string): Promise<void> {
  try {
    const sanitizedStorageKey = path.basename(storageKey)
    const oldAvatarPath = path.resolve(process.cwd(), AVATAR_UPLOADS_DIR, sanitizedStorageKey)
    await unlink(oldAvatarPath)
  } catch {
    // Upload replacement should succeed even when old file is already missing.
  }
}

export async function updateMyProfile(req: Request, res: Response) {
  const auth = getRequestAuth(req)
  const input = validateUpdateProfilePayload(req.body)
  const user = await updateUserProfileById(auth.userId, input)

  return res.status(200).json({ user })
}

export async function updateMyPassword(req: Request, res: Response) {
  const auth = getRequestAuth(req)
  const input = validateUpdatePasswordPayload(req.body)
  await updateUserPasswordById(auth.userId, input)

  return res.status(200).json({ message: "Senha atualizada com sucesso." })
}

export async function uploadMyAvatar(req: Request, res: Response) {
  const auth = getRequestAuth(req)

  if (!req.file) {
    throw new AppError(400, "avatar file is required")
  }

  const avatarStorageKey = req.file.filename
  const avatarUrl = `/uploads/avatars/${avatarStorageKey}`

  const { user, previousAvatarStorageKey } = await replaceUserAvatarById(auth.userId, {
    avatarUrl,
    avatarStorageKey,
  })

  if (previousAvatarStorageKey && previousAvatarStorageKey !== avatarStorageKey) {
    await removeOldAvatar(previousAvatarStorageKey)
  }

  return res.status(200).json({ avatarUrl: user.avatarUrl, user })
}
