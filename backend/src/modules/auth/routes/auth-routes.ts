import { Router } from "express"
import {
  confirmResetPassword,
  forgotPassword,
  login,
  logout,
  me,
  register,
} from "../controllers/auth-controller"

const authRoutes = Router()
authRoutes.post("/auth/register", register)
authRoutes.post("/auth/login", login)
authRoutes.post("/auth/logout", logout)
authRoutes.get("/auth/me", me)
authRoutes.post("/auth/forgot-password", forgotPassword)
authRoutes.post("/auth/reset-password", confirmResetPassword)

export default authRoutes
