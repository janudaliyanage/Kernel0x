import fs from "fs/promises"
import path from "path"
import { existsSync, mkdirSync } from "fs"
import { fileURLToPath } from "url"
import crypto from "crypto"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, "../../data")
const usersFile = path.join(dataDir, "users.json")

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

class UserStore {
  constructor() {
    this.lock = Promise.resolve()
  }

  async _readUsers() {
    try {
      if (!existsSync(usersFile)) {
        await fs.writeFile(usersFile, JSON.stringify([], null, 2), "utf-8")
        return []
      }
      const data = await fs.readFile(usersFile, "utf-8")
      return JSON.parse(data || "[]")
    } catch (err) {
      console.error("[UserStore] Error reading users file:", err)
      return []
    }
  }

  async _writeUsers(users) {
    const tempFile = `${usersFile}.tmp.${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(users, null, 2), "utf-8")
    await fs.rename(tempFile, usersFile)
  }

  async _withLock(fn) {
    const nextLock = this.lock.then(fn).catch(err => {
      console.error("[UserStore Lock Error]", err)
      throw err
    })
    this.lock = nextLock.then(() => {})
    return nextLock
  }

  async findByEmail(email) {
    if (!email) return null
    const users = await this._readUsers()
    return users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase()) || null
  }

  async findByUsername(username) {
    if (!username) return null
    const users = await this._readUsers()
    return users.find(u => u.username && u.username.toLowerCase() === username.trim().toLowerCase()) || null
  }

  async findById(id) {
    if (!id) return null
    const users = await this._readUsers()
    return users.find(u => u.id === id) || null
  }

  async createUser(userData) {
    return this._withLock(async () => {
      const users = await this._readUsers()
      const newUser = {
        id: crypto.randomUUID(),
        username: userData.username.trim(),
        email: (userData.email || "").trim().toLowerCase(),
        passwordHash: userData.passwordHash,
        teamName: (userData.teamName || "").trim(),
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
        solvedStages: userData.solvedStages || [],
        points: userData.points || 0,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
      }
      users.push(newUser)
      await this._writeUsers(users)
      return newUser
    })
  }

  async updateUser(id, updateData) {
    return this._withLock(async () => {
      const users = await this._readUsers()
      const index = users.findIndex(u => u.id === id)
      if (index === -1) return null

      users[index] = {
        ...users[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      await this._writeUsers(users)
      return users[index]
    })
  }

  async getAllUsersCount() {
    const users = await this._readUsers()
    return users.length
  }

  async getAllUsers() {
    const users = await this._readUsers()
    return users.map(u => ({
      id: u.id,
      username: u.username,
      teamName: u.teamName || "",
      points: u.points || 0,
      solvedStages: u.solvedStages || [],
      stageTimes: u.stageTimes || {},
      lastSolvedAt: u.lastSolvedAt || null,
    }))
  }
}

export const userStore = new UserStore()
