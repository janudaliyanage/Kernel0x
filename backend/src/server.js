import express from "express"
import cors from "cors"
import { config } from "./config/config.js"
import authRoutes from "./routes/auth.routes.js"
import ctfRoutes from "./routes/ctf.routes.js"
import { userStore } from "./db/store.js"

// Initialize Express gateway

const app = express()

// Middleware
app.use(cors({
  origin: [
    config.clientUrl,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger for development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split("T")[1].slice(0, 8)
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`)
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/ctf", ctfRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "Kernel0X CTF Gateway",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})

// Public CTF stats
app.get("/api/stats", async (req, res) => {
  try {
    const participantCount = await userStore.getAllUsersCount()
    res.json({
      success: true,
      stages: 4,
      questions: 6,
      registeredOperatives: participantCount,
      eventDate: "September 2026",
      status: "LIVE_RECON",
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching stats" })
  }
})

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found.`,
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("[ServerError]", err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error occurred.",
  })
})

const server = app.listen(config.port, () => {
  console.log("\n" + "=".repeat(60))
  console.log("  >>> KERNEL0X CTF BACKEND SERVER ACTIVE <<<")
  console.log("=".repeat(60))
  console.log(`  PORT        : ${config.port}`)
  console.log(`  ENVIRONMENT : ${config.nodeEnv}`)
  console.log(`  HEALTH URL  : http://localhost:${config.port}/api/health`)
  console.log(`  AUTH API    : http://localhost:${config.port}/api/auth`)
  console.log("=".repeat(60) + "\n")
})

export default app
