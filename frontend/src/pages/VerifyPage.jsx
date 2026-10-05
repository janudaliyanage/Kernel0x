import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { ShieldCheck, Terminal, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function VerifyPage() {
  const [searchParams] = useSearchParams()
  const { verifyEmail, resendCode } = useAuth()
  const navigate = useNavigate()

  const initialEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !code) {
      setErrorMsg("Please provide your email and the 6-digit verification code.")
      return
    }

    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const data = await verifyEmail({ email: email.trim(), code: code.trim() })
      if (data.success) {
        setSuccessMsg("Email verified successfully! Entering Kernel0X CTF Event Platform...")
        setTimeout(() => {
          navigate(data.redirectUrl || "/ctf-portal")
        }, 1200)
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid or expired verification code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || !email) return
    setIsLoading(true)
    setErrorMsg("")

    try {
      const data = await resendCode(email.trim())
      if (data.success) {
        setSuccessMsg("A new verification code has been dispatched to your email inbox.")
        setCooldown(60)
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to resend code.")
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
              KERNEL0X // EMAIL_VERIFICATION
            </span>
          </div>
          <Link to="/" className="font-mono text-xs text-gray-500 hover:text-[#9dff1f]">
            [ RETURN HOME ]
          </Link>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 bg-[#9dff1f]/10 border border-[#9dff1f]/40 px-2 py-0.5 mb-2 font-mono text-[10px] text-[#9dff1f]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HANDSHAKE VERIFICATION</span>
            </div>
            <h1 className="font-heading text-3xl text-white tracking-wide">VERIFY PARTICIPATION</h1>
            <p className="font-mono text-xs text-gray-400 mt-1">
              Confirm your email with the 6-digit verification code sent to your email inbox.
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
              <label className="block font-mono text-xs text-gray-400 mb-1">REGISTERED EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@sliit.lk"
                className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-white text-sm px-3 py-2.5 font-mono outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1">6-DIGIT VERIFICATION CODE</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full bg-[#070907] border-2 border-[#9dff1f]/60 focus:border-[#9dff1f] text-[#9dff1f] text-center text-2xl tracking-[0.5em] font-mono py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-sm py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>VERIFYING CODE...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM &amp; ENTER CTF EVENT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1c231d] flex items-center justify-between font-mono text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isLoading || !email}
              className="text-gray-400 hover:text-[#9dff1f] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <Link to="/login" className="text-gray-500 hover:text-white transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
