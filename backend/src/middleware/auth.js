import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import { userStore } from "../db/store.js"

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing or invalid format",
      })
    }

    const token = authHeader.split(" ")[1]
    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session token expired. Please sign in again.",
        })
      }
      return res.status(401).json({
        success: false,
        message: "Invalid session token",
      })
    }

    const user = await userStore.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
      })
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      teamName: user.teamName,
      isVerified: user.isVerified,
    }

    next()
  } catch (err) {
    console.error("[requireAuth Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    })
  }
}
