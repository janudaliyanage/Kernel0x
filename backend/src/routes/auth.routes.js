import { Router } from "express"
import {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.post("/register", register)
router.post("/verify-email", verifyEmail)
router.post("/resend-code", resendVerificationCode)
router.post("/login", login)
router.get("/me", requireAuth, getCurrentUser)

export default router
