import { Router } from "express"
import { getProgress, submitFlag, resetProgress, getLeaderboard } from "../controllers/ctf.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/progress", requireAuth, getProgress)
router.get("/leaderboard", requireAuth, getLeaderboard)
router.post("/submit", requireAuth, submitFlag)
router.post("/reset", requireAuth, resetProgress)

export default router
