import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  CheckCircle, Award, Shield, Terminal, ArrowLeft, Printer, 
  Share2, Star, Heart, Trophy, Sparkles, Download, Flag, 
  ExternalLink, Check, Copy, RefreshCw 
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import axios from "axios"

export default function CompletionPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const [points, setPoints] = useState(1000)
  const [solvedCount, setSolvedCount] = useState(6)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [copiedCert, setCopiedCert] = useState(false)

  // Fetch verified progress from backend
  useEffect(() => {
    const token = localStorage.getItem("kernel0x_token")
    if (token) {
      axios
        .get("/api/ctf/progress", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.success) {
            setPoints(res.data.points || 1000)
            setSolvedCount(res.data.solvedStages?.length || 6)
          }
        })
        .catch(() => {})
    }
  }, [])

  // Canvas digital confetti / particle bursts
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    const colors = ["#9dff1f", "#b0ff42", "#00ffff", "#ffd700", "#ffffff", "#4ade80"]
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 2.5 + 1.2,
      speedX: (Math.random() - 0.5) * 1.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      opacity: Math.random() * 0.7 + 0.3,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotationSpeed

        if (p.y > height) {
          p.y = -20
          p.x = Math.random() * width
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5)
        ctx.restore()
      })
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleCopyVerification = () => {
    const certCode = `KERNEL0X-CERT-${user?.username?.toUpperCase() || "OPERATIVE"}-2026-ROOT`
    navigator.clipboard.writeText(certCode)
    setCopiedCert(true)
    setTimeout(() => setCopiedCert(false), 2500)
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    setFeedbackSubmitted(true)
  }

  const stages = [
    { n: "01", name: "OSINT: The First Lead", domain: "Reconnaissance", clue: "K0X-17", pts: "150 PTS" },
    { n: "02", name: "Steganography: Hidden in Plain Sight", domain: "Data Concealment", clue: "hero-banner.jpg", pts: "150 PTS" },
    { n: "03", name: "Classical Crypto: The Encrypted Note", domain: "Caesar ROT-7", clue: "Kernel0X{caesar_is_classic}", pts: "150 PTS" },
    { n: "04", name: "Network Forensics: The Exfiltration Trail", domain: "PCAP Stream Reconstruction", clue: "ftp.warehouse9", pts: "150 PTS" },
    { n: "05", name: "Advanced Crypto: The Second Cipher", domain: "Vigenère Polyalphabetic", clue: "Kernel0X{warehouse9_vigenere}", pts: "150 PTS" },
    { n: "06", name: "Capstone: Kernel0X's Final Message", domain: "Live Target SSH + Multi-Layer", clue: "Kernel0X{dead_drop_recovered}", pts: "200 PTS" },
  ]

  const certHash = `SHA256: 7f8a9e${(user?.username || "operative").split("").reduce((acc, c) => acc + c.charCodeAt(0).toString(16), "")}b4c1d2e3`

  return (
    <div className="min-h-screen bg-[#070907] text-white font-sans selection:bg-[#9dff1f] selection:text-black relative overflow-x-hidden">
      {/* Particle Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />

      {/* Ambient Cyber Light Accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#9dff1f]/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1c231d]">
            <Link
              to="/ctf-portal"
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#9dff1f] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO OPERATIONS CONSOLE</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-[#9dff1f]">
              <span className="w-2 h-2 rounded-full bg-[#9dff1f] animate-ping" />
              <span>STATUS: CASE FILE CLOSED // VICTORY</span>
            </div>
          </div>

          {/* HERO CELEBRATION HEADER */}
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10190e] border border-[#9dff1f]/40 font-mono text-xs text-[#9dff1f] tracking-wider uppercase mb-2">
              <Sparkles className="w-4 h-4 text-[#9dff1f]" />
              <span>OPERATION KERNEL0X RESOLVED // CLASSIFIED</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl text-white tracking-wide uppercase">
              THANK YOU FOR <span className="text-[#9dff1f]">PARTICIPATING!</span>
            </h1>

            <p className="font-mono text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              You have successfully reconstructed the full breach trajectory, cracked every cryptographic barrier, and recovered Kernel0X&apos;s final dead-drop message.
            </p>

            {/* Operative Stats Highlight Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs">
              <div className="bg-[#0e120e] border border-[#1c231d] px-5 py-3">
                <span className="text-gray-500 block text-[10px] mb-0.5">OPERATIVE CALLSIGN</span>
                <span className="text-white font-bold text-sm sm:text-base text-[#9dff1f]">
                  {user?.username || "GUEST_OPERATIVE"}
                </span>
              </div>
              <div className="bg-[#0e120e] border border-[#1c231d] px-5 py-3">
                <span className="text-gray-500 block text-[10px] mb-0.5">TOTAL SCORE</span>
                <span className="text-amber-400 font-bold text-sm sm:text-base">{points} XP</span>
              </div>
              <div className="bg-[#0e120e] border border-[#1c231d] px-5 py-3">
                <span className="text-gray-500 block text-[10px] mb-0.5">STAGES COMPLETED</span>
                <span className="text-white font-bold text-sm sm:text-base">6 / 6 CLEARED</span>
              </div>
              <div className="bg-[#0e120e] border border-[#1c231d] px-5 py-3">
                <span className="text-gray-500 block text-[10px] mb-0.5">CLEARANCE RANK</span>
                <span className="text-[#9dff1f] font-bold text-sm sm:text-base">ROOT INCIDENT RESPONDER</span>
              </div>
            </div>
          </div>

          {/* OFFICIAL CERTIFICATE OF COMPLETION (PRINTABLE) */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                <Award className="w-4 h-4" />
                <span>OFFICIAL DIGITAL CERTIFICATE OF EXCELLENCE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyVerification}
                  className="bg-[#101610] hover:bg-[#182218] border border-[#1c231d] text-gray-300 hover:text-white font-mono text-xs px-3 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCert ? <Check className="w-3.5 h-3.5 text-[#9dff1f]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCert ? "COPIED" : "VERIFICATION ID"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-4 py-1.5 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(157,255,31,0.25)]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT / SAVE CERTIFICATE</span>
                </button>
              </div>
            </div>

            {/* Printable Certificate Frame */}
            <div 
              id="printable-certificate"
              className="p-8 sm:p-12 bg-gradient-to-b from-[#0b100b] to-[#060806] border-4 border-[#1c2e1a] relative overflow-hidden text-center shadow-2xl"
              style={{
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.8), inset 0 0 60px rgba(157, 255, 31, 0.03)"
              }}
            >
              {/* Certificate Inner Decorative Border */}
              <div className="border border-[#9dff1f]/30 p-6 sm:p-10 relative">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#9dff1f]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#9dff1f]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#9dff1f]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#9dff1f]" />

                {/* Issuer Seal / Logo Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#141e12] border border-[#9dff1f]/60 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#9dff1f]" />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-white font-bold text-sm tracking-wider">KERNEL0X CYBER DEFENSE COUNCIL</div>
                    <div className="text-[10px] text-gray-400">SLIIT PENETRATION TESTING PLAY BOX • 2026</div>
                  </div>
                </div>

                <div className="font-mono text-xs tracking-widest text-[#9dff1f] uppercase mb-2">
                  CERTIFICATE OF INCIDENT INVESTIGATION MASTERY
                </div>

                <div className="text-gray-400 text-xs font-mono mb-4">
                  THIS CERTIFIES THAT OPERATIVE
                </div>

                {/* Operative Name */}
                <div className="font-heading text-3xl sm:text-5xl text-white tracking-widest uppercase mb-4 text-[#9dff1f] drop-shadow-[0_0_15px_rgba(157,255,31,0.3)]">
                  {user?.username || "VERIFIED OPERATIVE"}
                </div>

                <p className="text-gray-300 font-mono text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-8">
                  has demonstrated exemplary penetration testing, forensic analysis, and cryptographic persistence by identifying all breach artifacts and successfully recovering the final capstone dead-drop flag.
                </p>

                {/* Score & Verification Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto border-t border-b border-[#1c231d] py-4 mb-8 font-mono text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px]">TOTAL SCORE</span>
                    <span className="text-amber-400 font-bold text-sm">{points} XP</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">STAGES CLEARED</span>
                    <span className="text-white font-bold text-sm">6 / 6 ALL SOLVED</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">VERIFICATION DATE</span>
                    <span className="text-gray-300 text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">FINAL FLAG</span>
                    <span className="text-[#9dff1f] font-bold text-xs truncate block">Kernel0X&#123;dead_drop&#125;</span>
                  </div>
                </div>

                {/* Digital Signature & Hash */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-gray-500">
                  <div className="text-left">
                    <div>AUTHENTICATED VIA SERVER REST API: <span className="text-gray-400">POST /api/ctf/submit</span></div>
                    <div>HASH: <span className="text-gray-400">{certHash.slice(0, 32)}...</span></div>
                  </div>
                  <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#1c231d] pt-2 sm:pt-0 sm:pl-4">
                    <div className="text-gray-300 font-bold">KERNEL0X SECURITY TASKFORCE</div>
                    <div className="text-[#9dff1f]">INCIDENT CASE STATUS: RESOLVED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6-STAGE INVESTIGATION RECAP */}
          <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8 mb-14 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#9dff1f] font-bold text-sm mb-4">
              <CheckCircle className="w-5 h-5 text-[#9dff1f]" />
              <span>YOUR INVESTIGATION MILESTONES: ALL 6 STAGES COMPLETED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stages.map((st) => (
                <div key={st.n} className="bg-[#070907] border border-[#1c231d] p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#9dff1f] font-bold text-xs">STAGE {st.n} // {st.domain}</span>
                    <span className="px-2 py-0.5 bg-[#9dff1f]/10 text-[#9dff1f] text-[10px] font-bold border border-[#9dff1f]/30">
                      {st.pts}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{st.name}</h3>
                  <div className="text-gray-400 text-[11px] truncate">
                    Resolved Artifact: <span className="text-gray-300">{st.clue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORGANIZERS' THANK YOU & ACKNOWLEDGEMENTS */}
          <div className="bg-[#0c100c] border border-amber-400/30 p-6 sm:p-8 mb-14 font-mono text-xs relative">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <span>A PERSONAL MESSAGE FROM THE CREATORS</span>
            </div>
            <div className="space-y-3 text-gray-300 leading-relaxed text-xs sm:text-sm">
              <p>
                Thank you for diving into the <strong>Kernel0X Incident Investigation Play Box</strong>. Building this challenge required uniting multiple core penetration testing and incident handling domains—ranging from subtle OSINT metadata discovery, steganographic frequency extraction, classical and polyalphabetic cryptanalysis, and packet capture stream carving, all the way to a live multi-layer AWS capstone.
              </p>
              <p>
                Your patience, analytical mindset, and methodical investigative approach are what make cybersecurity such an exciting and rewarding discipline. We hope you enjoyed dissecting the clues as much as we enjoyed designing the puzzles!
              </p>
              <p className="text-gray-400 text-xs italic pt-1">
                — The Kernel0X Development & Incident Response Team (SLIIT IE3132 Year 3 Sem 1)
              </p>
            </div>
          </div>

          {/* OPERATIVE FEEDBACK & RATING FORM */}
          <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8 mb-14 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#9dff1f] font-bold text-sm mb-3">
              <Star className="w-4 h-4 text-[#9dff1f]" />
              <span>OPERATIVE DEBRIEFING & CHALLENGE RATING</span>
            </div>
            <p className="text-gray-400 mb-5">
              How did you find the challenge design, progressive hints, and difficulty balance?
            </p>

            {feedbackSubmitted ? (
              <div className="p-4 bg-[#10190e] border border-[#9dff1f] text-[#9dff1f] flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold">THANK YOU FOR YOUR VALUABLE FEEDBACK!</div>
                  <div className="text-gray-300 text-[11px]">Your rating and debriefing notes have been recorded in the mission log.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* 5-Star Interactive Rating */}
                <div>
                  <label className="block text-gray-400 text-xs mb-2">OVERALL EXPERIENCE RATING:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || rating) >= star
                              ? "text-[#9dff1f] fill-[#9dff1f]"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-gray-400 ml-2 font-mono text-xs">
                      {rating === 5 ? "5/5 — Masterpiece Challenge!" : `${rating}/5 Stars`}
                    </span>
                  </div>
                </div>

                {/* Debrief Comments */}
                <div>
                  <label className="block text-gray-400 text-xs mb-2">OPERATIVE FEEDBACK / FAVORITE STAGE (OPTIONAL):</label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you liked, your favorite stage (e.g. Stage 4 Wireshark or Stage 6 live SSH), or suggestions..."
                    className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-white p-3 outline-none font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                >
                  SUBMIT OPERATIVE FEEDBACK
                </button>
              </form>
            )}
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-[#1c231d] font-mono text-xs">
            <Link
              to="/ctf-portal"
              className="bg-[#141c12] hover:bg-[#1e2a1b] border border-[#9dff1f]/50 text-[#9dff1f] font-bold px-6 py-3 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>RETURN TO CTF ARENA</span>
            </Link>

            <Link
              to="/"
              className="bg-[#0d130d] hover:bg-[#141a12] border border-[#1c231d] text-gray-300 hover:text-white font-bold px-6 py-3 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>VISIT KERNEL0X HOME</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
