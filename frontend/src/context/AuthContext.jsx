import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem("kernel0x_token") || null)
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({ isOpen: false, view: "login", email: "" })

  // Initialize and verify existing token
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success && res.data.user) {
          setUser(res.data.user)
        } else {
          logout()
        }
      } catch (err) {
        console.warn("[Auth] Session expired or invalid token:", err.response?.data?.message || err.message)
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  const openAuthModal = (view = "login", email = "") => {
    setModalState({ isOpen: true, view, email })
  }

  const closeAuthModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const register = async ({ username, email, password, teamName }) => {
    const res = await axios.post("/api/auth/register", {
      username,
      email,
      password,
      teamName,
    })
    return res.data
  }

  const verifyEmail = async ({ email, code }) => {
    const res = await axios.post("/api/auth/verify-email", {
      email,
      code,
    })
    if (res.data.success && res.data.token) {
      localStorage.setItem("kernel0x_token", res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
    }
    return res.data
  }

  const resendCode = async (email) => {
    const res = await axios.post("/api/auth/resend-code", { email })
    return res.data
  }

  const login = async ({ login: identifier, password }) => {
    const res = await axios.post("/api/auth/login", {
      login: identifier,
      password,
    })
    if (res.data.success && res.data.token) {
      localStorage.setItem("kernel0x_token", res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
    }
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("kernel0x_token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && user.isVerified,
        modalState,
        openAuthModal,
        closeAuthModal,
        register,
        verifyEmail,
        resendCode,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
