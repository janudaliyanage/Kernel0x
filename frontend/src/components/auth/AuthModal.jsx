import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, ShieldCheck, Lock, User, Terminal, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function AuthModal() {
  const { modalState, closeAuthModal, login, register } = useAuth()
  const navigate = useNavigate()

  // Local view: "login" | "register"
  const [view, setView] = useState("login")

  // Form states
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ username: "", password: "", teamName: "" })

  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const modalRef = useRef(null)

  // Sync modal view when opened externally
  useEffect(() => {
    if (modalState.isOpen) {
      setView(modalState.view === "register" ? "register" : "login")
      setErrorMsg("")
      setSuccessMsg("")
    }
  }, [modalState])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalState.isOpen) {
        closeAuthModal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalState.isOpen, closeAuthModal])

  if (!modalState.isOpen) return null

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const data = await login({
        login: loginForm.identifier.trim(),
        password: loginForm.password,
      })

      if (data.success) {
        setSuccessMsg(data.message || "Access Granted. Entering Kernel0X CTF...")
        setTimeout(() => {
          closeAuthModal()
          navigate(data.redirectUrl || "/ctf-portal")
        }, 800)
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK" ? "Unable to connect to backend server. Ensure backend is running." : err.message) ||
        "Failed to authenticate. Check your credentials."
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const data = await register({
        username: registerForm.username.trim(),
        password: registerForm.password,
        teamName: registerForm.teamName.trim(),
      })

      if (data.success) {
        setSuccessMsg(data.message || "Operative enlisted! Entering Kernel0X CTF...")
        setTimeout(() => {
          closeAuthModal()
          navigate(data.redirectUrl || "/ctf-portal")
        }, 800)
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK" ? "Unable to connect to backend server. Ensure backend is running." : null) ||
        err.message ||
        "Failed to register operative."
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-[#0e120e] border border-[#9dff1f]/40 shadow-[0_0_50px_rgba(157,255,31,0.15)] rounded-none overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Terminal Bar */}
        <div className="bg-[#141a13] px-4 py-3 border-b border-[#9dff1f]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#9dff1f]" />
            <span className="font-mono text-xs text-[#9dff1f] tracking-widest font-semibold uppercase">
              {view === "register" ? "KERNEL0X // OPERATIVE_REGISTRATION" : "KERNEL0X // AUTHENTICATION_GATE"}
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-gray-400 hover:text-[#9dff1f] transition-colors p-1 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-2 border-b border-[#1c231d] bg-[#0a0d0a]">
          <button
            type="button"
            onClick={() => {
              setView("login")
              setErrorMsg("")
              setSuccessMsg("")
            }}
            className={`py-3 font-mono text-xs tracking-wider font-semibold transition-all cursor-pointer ${
              view === "login"
                ? "bg-[#10140f] text-[#9dff1f] border-b-2 border-[#9dff1f]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            [ SIGN IN ]
          </button>
          <button
            type="button"
            onClick={() => {
              setView("register")
              setErrorMsg("")
              setSuccessMsg("")
            }}
            className={`py-3 font-mono text-xs tracking-wider font-semibold transition-all cursor-pointer ${
              view === "register"
                ? "bg-[#10140f] text-[#9dff1f] border-b-2 border-[#9dff1f]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            [ JOIN CTF ]
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          {/* Notification Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 flex items-start gap-2.5 text-red-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#9dff1f]/10 border border-[#9dff1f]/40 flex items-start gap-2.5 text-[#9dff1f] text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#9dff1f]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN VIEW */}
          {view === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-left mb-4">
                <h3 className="font-heading text-xl text-white tracking-wide">OPERATIVE LOGIN</h3>
                <p className="font-mono text-xs text-gray-400">Authenticate using your username and password.</p>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">OPERATIVE CODENAME (USERNAME)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="e.g. ghost_in_shell"
                    className="w-full bg-[#0a0d0a] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0d0a] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-sm py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER CTF PORTAL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView("register")
                    setErrorMsg("")
                  }}
                  className="font-mono text-xs text-gray-400 hover:text-[#9dff1f] transition-colors cursor-pointer"
                >
                  Need to enlist in the CTF? <span className="underline text-[#9dff1f]">Join now &gt;</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTER (JOIN CTF) VIEW */}
          {view === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-left mb-4">
                <h3 className="font-heading text-xl text-white tracking-wide">JOIN KERNEL0X CTF</h3>
                <p className="font-mono text-xs text-gray-400">
                  Enlist for the cybersecurity competition. Direct portal access.
                </p>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">OPERATIVE CODENAME (USERNAME)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    placeholder="e.g. ghost_in_shell"
                    className="w-full bg-[#0a0d0a] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">TEAM NAME / AFFILIATION (OPTIONAL)</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={registerForm.teamName}
                    onChange={(e) => setRegisterForm({ ...registerForm, teamName: e.target.value })}
                    placeholder="e.g. KernelPanic"
                    className="w-full bg-[#0a0d0a] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1">PASSWORD (MIN 6 CHARACTERS)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0d0a] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-sm py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ENLISTING OPERATIVE...</span>
                  </>
                ) : (
                  <>
                    <span>JOIN CTF &amp; ENTER PORTAL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView("login")
                    setErrorMsg("")
                  }}
                  className="font-mono text-xs text-gray-400 hover:text-[#9dff1f] transition-colors cursor-pointer"
                >
                  Already registered? <span className="underline text-[#9dff1f]">Sign in directly &gt;</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
