import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userStore } from "../db/store.js"
import { config } from "../config/config.js"
import { sendVerificationEmail } from "../services/email.service.js"

// Helper to generate 6-digit numeric OTP
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Helper to validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function register(req, res) {
  try {
    const { username, email, password, teamName } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      })
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long.",
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUsername = username.trim()

    // Check for existing verified users
    const existingByEmail = await userStore.findByEmail(normalizedEmail)
    if (existingByEmail && existingByEmail.isVerified) {
      return res.status(400).json({
        success: false,
        message: "An operative with this email is already registered. Please sign in.",
      })
    }

    const existingByUsername = await userStore.findByUsername(normalizedUsername)
    if (existingByUsername && existingByUsername.id !== existingByEmail?.id && existingByUsername.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Codename / username is already taken. Please choose another.",
      })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const verificationCode = generateVerificationCode()
    const verificationExpires = Date.now() + 15 * 60 * 1000 // 15 mins

    let user
    if (existingByEmail && !existingByEmail.isVerified) {
      // Update existing unverified record
      user = await userStore.updateUser(existingByEmail.id, {
        username: normalizedUsername,
        passwordHash,
        teamName: (teamName || "").trim(),
        verificationCode,
        verificationExpires,
      })
    } else {
      user = await userStore.createUser({
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        teamName: (teamName || "").trim(),
        verificationCode,
        verificationExpires,
      })
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(normalizedEmail, normalizedUsername, verificationCode)
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error || "Failed to dispatch verification email. Please check server email configuration.",
      })
    }

    return res.status(201).json({
      success: true,
      message: "Operative registered. 6-digit verification code has been dispatched to your email address.",
      email: normalizedEmail,
      requiresVerification: true,
    })
  } catch (err) {
    console.error("[Register Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
    })
  }
}

export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await userStore.findByEmail(normalizedEmail)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      })
    }

    if (user.isVerified) {
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      )
      return res.json({
        success: true,
        message: "Email is already verified. Accessing CTF platform...",
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
    }

    if (!user.verificationCode || user.verificationCode !== code.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check and try again.",
      })
    }

    if (Date.now() > user.verificationExpires) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      })
    }

    // Mark user verified
    const updatedUser = await userStore.updateUser(user.id, {
      isVerified: true,
      verificationCode: null,
      verificationExpires: null,
      lastLoginAt: new Date().toISOString(),
    })

    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, username: updatedUser.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    return res.json({
      success: true,
      message: "Email verification successful! Welcome to Kernel0X CTF.",
      token,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        teamName: updatedUser.teamName,
        isVerified: true,
      },
      redirectUrl: config.ctfEventUrl,
    })
  } catch (err) {
    console.error("[Verify Email Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error during email verification.",
    })
  }
}

export async function resendVerificationCode(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await userStore.findByEmail(normalizedEmail)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. You can sign in directly.",
      })
    }

    const newCode = generateVerificationCode()
    const newExpires = Date.now() + 15 * 60 * 1000

    await userStore.updateUser(user.id, {
      verificationCode: newCode,
      verificationExpires: newExpires,
    })

    const emailResult = await sendVerificationEmail(normalizedEmail, user.username, newCode)
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error || "Failed to dispatch verification email.",
      })
    }

    return res.json({
      success: true,
      message: "A fresh verification code has been dispatched to your email inbox.",
    })
  } catch (err) {
    console.error("[Resend Code Error]", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error while resending verification code.",
    })
  }
}

export async function login(req, res) {
  try {
    const { login: identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required.",
      })
    }

    const trimmed = identifier.trim()
    let user = await userStore.findByEmail(trimmed)
    if (!user) {
      user = await userStore.findByUsername(trimmed)
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

    // Check email verification status
    if (!user.isVerified) {
      const newCode = generateVerificationCode()
      const newExpires = Date.now() + 15 * 60 * 1000
      await userStore.updateUser(user.id, {
        verificationCode: newCode,
        verificationExpires: newExpires,
      })
      await sendVerificationEmail(user.email, user.username, newCode)

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: "Email verification required before accessing CTF event. A verification code has been sent to your email inbox.",
      })
    }

    // Update last login
    await userStore.updateUser(user.id, {
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
