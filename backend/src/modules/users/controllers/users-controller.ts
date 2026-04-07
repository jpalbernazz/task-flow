import { unlink, writeFile } from "node:fs/promises"
import { randomUUID } from "node:crypto"
import path from "node:path"
import type { Request, Response } from "express"
import { AVATAR_UPLOADS_DIR } from "../../../shared/auth/auth-config"
import { AppError } from "../../../shared/http/app-error"
import { getRequestAuth } from "../../../shared/http/request-auth"
import { replaceUserAvatarById, updateUserPasswordById, updateUserProfileById } from "../services/users-service"
import { validateUpdatePasswordPayload, validateUpdateProfilePayload } from "../validators/users-validator"

interface AvatarFileType {
  extension: "jpg" | "png" | "webp"
}

function hasBytes(buffer: Buffer, ...bytes: number[]): boolean {
  if (buffer.length < bytes.length) {
    return false
  }

  return bytes.every((value, index) => buffer[index] === value)
}

function isWebp(buffer: Buffer): boolean {
  if (buffer.length < 12) {
    return false
  }

  const isRiff =
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 // F

  const isWebpHeader =
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P

  return isRiff && isWebpHeader
}

function isGif(buffer: Buffer): boolean {
  return (
    hasBytes(buffer, 0x47, 0x49, 0x46, 0x38, 0x37, 0x61) || // GIF87a
    hasBytes(buffer, 0x47, 0x49, 0x46, 0x38, 0x39, 0x61) // GIF89a
  )
}

function detectAvatarFileType(buffer: Buffer): AvatarFileType | "gif" | null {
  if (hasBytes(buffer, 0xff, 0xd8, 0xff)) {
    return { extension: "jpg" }
  }

  if (hasBytes(buffer, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
    return { extension: "png" }
  }

  if (isWebp(buffer)) {
    return { extension: "webp" }
  }

  if (isGif(buffer)) {
    return "gif"
  }

  return null
}

function resolveAvatarPath(storageKey: string): string {
  const sanitizedStorageKey = path.basename(storageKey)
  return path.resolve(process.cwd(), AVATAR_UPLOADS_DIR, sanitizedStorageKey)
}

async function removeOldAvatar(storageKey: string): Promise<void> {
  try {
    const oldAvatarPath = resolveAvatarPath(storageKey)
    await unlink(oldAvatarPath)
  } catch {
    // Upload replacement should succeed even when old file is already missing.
  }
}

async function removeNewAvatar(storageKey: string): Promise<void> {
  try {
    const avatarPath = resolveAvatarPath(storageKey)
    await unlink(avatarPath)
  } catch {
    // Best effort rollback. If file is already missing we can ignore.
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
  await updateUserPasswordById(auth.userId, input, auth.sessionId)

  return res.status(200).json({ message: "Senha atualizada com sucesso." })
}

export async function uploadMyAvatar(req: Request, res: Response) {
  const auth = getRequestAuth(req)

  if (!req.file) {
    throw new AppError(400, "avatar file is required")
  }

  const fileType = detectAvatarFileType(req.file.buffer)
  if (fileType === "gif") {
    throw new AppError(400, "avatar must be jpeg, png or webp")
  }

  if (!fileType) {
    throw new AppError(400, "avatar must be jpeg, png or webp")
  }

  const avatarStorageKey = `${randomUUID()}.${fileType.extension}`
  await writeFile(resolveAvatarPath(avatarStorageKey), req.file.buffer)

  const avatarUrl = `/uploads/avatars/${avatarStorageKey}`

  let userResult: Awaited<ReturnType<typeof replaceUserAvatarById>> | null = null
  try {
    userResult = await replaceUserAvatarById(auth.userId, {
      avatarUrl,
      avatarStorageKey,
    })
  } catch (error) {
    await removeNewAvatar(avatarStorageKey)
    throw error
  }

  const { user, previousAvatarStorageKey } = userResult

  if (previousAvatarStorageKey && previousAvatarStorageKey !== avatarStorageKey) {
    await removeOldAvatar(previousAvatarStorageKey)
  }

  return res.status(200).json({ avatarUrl: user.avatarUrl, user })
}
