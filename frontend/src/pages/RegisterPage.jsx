import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ShieldCheck, Mail, Lock, User, Terminal, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: "", email: "", password: "", teamName: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const data = await register(form)
      if (data.success) {
        setSuccessMsg("Registration transmitted. Redirecting to email verification...")
        setTimeout(() => {
          navigate(`/verify?email=${encodeURIComponent(data.email)}`)
        }, 1000)
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please check your inputs.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070907] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0e120e] border border-[#9dff1f]/40 shadow-[0_0_50px_rgba(157,255,31,0.15)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#141a13] px-4 py-3 border-b border-[#9dff1f]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#9dff1f]" />
            <span className="font-mono text-xs text-[#9dff1f] font-semibold tracking-wider">
              KERNEL0X // OPERATIVE_ENLISTMENT
            </span>
          </div>
          <Link to="/" className="font-mono text-xs text-gray-500 hover:text-[#9dff1f]">
            [ RETURN HOME ]
          </Link>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="font-heading text-3xl text-white tracking-wide">JOIN KERNEL0X CTF</h1>
            <p className="font-mono text-xs text-gray-400 mt-1">
              Create your operative account. Email verification is required to participate.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 flex items-start gap-2 text-red-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#9dff1f]/10 border border-[#9dff1f]/40 flex items-start gap-2 text-[#9dff1f] text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1">OPERATIVE CODENAME</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  minLength={3}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="e.g. ghost_cyber"
                  className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1">OFFICIAL EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="student@sliit.lk"
                  className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1">TEAM NAME / AFFILIATION (OPTIONAL)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={form.teamName}
                  onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                  placeholder="e.g. KernelHacks"
                  className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm pl-10 pr-3 py-2.5 font-mono outline-none transition-colors"
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
                  <span>TRANSMITTING REGISTRATION...</span>
                </>
              ) : (
                <>
                  <span>CONTINUE TO VERIFY EMAIL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1c231d] text-center font-mono text-xs text-gray-400">
            Already enlisted?{" "}
            <Link to="/login" className="text-[#9dff1f] hover:underline">
              Sign in directly &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
