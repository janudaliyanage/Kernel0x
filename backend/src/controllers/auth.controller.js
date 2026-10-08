import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userStore } from "../db/store.js"
import { config } from "../config/config.js"

export async function register(req, res) {
  try {
    const { username, password, teamName, email } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      })
    }

    const normalizedUsername = username.trim()
    if (normalizedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long.",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      })
    }

    // Check if username is already taken
    const existingByUsername = await userStore.findByUsername(normalizedUsername)
    if (existingByUsername) {
      return res.status(400).json({
        success: false,
        message: "Codename / username is already taken. Please choose another.",
      })
    }

    const normalizedEmail = (email || `${normalizedUsername.toLowerCase()}@kernel0x.local`).trim().toLowerCase()
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await userStore.createUser({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      teamName: (teamName || "").trim(),
      isVerified: true,
      verificationCode: null,
      verificationExpires: null,
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    return res.status(201).json({
      success: true,
      message: "Operative enlisted successfully. Welcome to Kernel0X CTF!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        teamName: user.teamName,
        isVerified: true,
      },
      requiresVerification: false,
      redirectUrl: config.ctfEventUrl,
    })
  } catch (err) {
    console.error("[Register Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
    })
  }
}

export async function login(req, res) {
  try {
    const { login: identifier, username, password } = req.body
    const loginUser = (identifier || username || "").trim()

    if (!loginUser || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      })
    }

    let user = await userStore.findByUsername(loginUser)
    if (!user) {
      user = await userStore.findByEmail(loginUser)
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Operative not found.",
      })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Access denied.",
      })
    }

    // Update last login
    await userStore.updateUser(user.id, {
      isVerified: true,
      lastLoginAt: new Date().toISOString(),
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    return res.json({
      success: true,
      message: "Authentication successful. Entering Kernel0X CTF...",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        teamName: user.teamName,
        isVerified: true,
      },
      redirectUrl: config.ctfEventUrl,
    })
  } catch (err) {
    console.error("[Login Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    })
  }
}

export async function verifyEmail(req, res) {
  return res.json({
    success: true,
    message: "Email verification is disabled. Direct access granted.",
    redirectUrl: config.ctfEventUrl,
  })
}

export async function resendVerificationCode(req, res) {
  return res.json({
    success: true,
    message: "Email verification is disabled.",
  })
}

export async function getCurrentUser(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user,
      redirectUrl: config.ctfEventUrl,
    })
  } catch (err) {
    console.error("[getCurrentUser Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching user profile.",
    })
  }
}
