import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"
import type { NextFunction, Request, Response } from "express"
import { Router } from "express"
import multer from "multer"
import { AVATAR_MAX_SIZE_BYTES, AVATAR_MAX_SIZE_MB, AVATAR_UPLOADS_DIR } from "../../../shared/auth/auth-config"
import { AppError } from "../../../shared/http/app-error"
import { requireAuth } from "../../../shared/http/require-auth"
import { updateMyPassword, updateMyProfile, uploadMyAvatar } from "../controllers/users-controller"

const usersRoutes = Router()

const allowedAvatarMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

const avatarsAbsoluteDir = path.resolve(process.cwd(), AVATAR_UPLOADS_DIR)
fs.mkdirSync(avatarsAbsoluteDir, { recursive: true })

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, avatarsAbsoluteDir)
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".bin"
    callback(null, `${Date.now()}-${randomUUID()}${extension.toLowerCase()}`)
  },
})

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: AVATAR_MAX_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedAvatarMimeTypes.has(file.mimetype)) {
      callback(new AppError(400, "avatar must be jpeg, png, webp or gif"))
      return
    }

    callback(null, true)
  },
})

function uploadAvatarMiddleware(req: Request, res: Response, next: NextFunction) {
  avatarUpload.single("avatar")(req, res, (error) => {
    if (!error) {
      return next()
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return next(new AppError(400, `avatar must be up to ${AVATAR_MAX_SIZE_MB}MB`))
    }

    return next(error)
  })
}

usersRoutes.use(requireAuth)
usersRoutes.patch("/users/me", updateMyProfile)
usersRoutes.patch("/users/me/password", updateMyPassword)
usersRoutes.post("/users/me/avatar", uploadAvatarMiddleware, uploadMyAvatar)

export default usersRoutes
