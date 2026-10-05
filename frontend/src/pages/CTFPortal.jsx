import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  ShieldCheck, 
  Terminal, 
  Flag, 
  CheckCircle, 
  Lock, 
  Unlock, 
  AlertCircle, 
  ExternalLink, 
  LogOut, 
  ChevronRight,
  Flame,
  Award,
  Compass,
  Download,
  HelpCircle,
  FileText,
  Check
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function CTFPortal() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Flag submission states
  const [flagInput, setFlagInput] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [activeTab, setActiveTab] = useState("stage1")

  // Load solved challenges from localStorage
  const [solvedChallenges, setSolvedChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem("kernel0x_solved_stages")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Points tracking
  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem("kernel0x_points")
      return saved ? parseInt(saved, 10) : 0
    } catch {
      return 0
    }
  })

  // Progressive hints
  const [hint1Revealed, setHint1Revealed] = useState(false)
  const [hint2Revealed, setHint2Revealed] = useState(false)

  // Status flags
  const isStage1Solved = solvedChallenges.includes("stage1")
  const isStage2Unlocked = isStage1Solved

  // Sync points and stages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kernel0x_solved_stages", JSON.stringify(solvedChallenges))
      localStorage.setItem("kernel0x_points", points.toString())
    } catch (err) {
      console.error(err)
    }
  }, [solvedChallenges, points])

  // Download investigation brief file
  const handleDownloadBrief = () => {
    const briefContent = `NexaLabs Security Investigation

NexaLabs has identified suspicious activity surrounding its public
e-commerce development project.

The security team believes the activity may have left traces
in publicly available developer information.

Initial lead:
NexaLabs maintains an online development presence.

Your task:
Identify the developer associated with the suspicious activity
and investigate the available public project history.

Useful tools:
- Web browser
- GitHub Search
- WHOIS
- ExifTool

Do not assume the first result is the answer.
Follow the evidence.`

    const blob = new Blob([briefContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "investigator-brief.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Handle Stage 1 answer submission
  const handleFlagSubmit = (e) => {
    e.preventDefault()
    if (!flagInput.trim()) return

    const cleaned = flagInput.trim()
    const upper = cleaned.toUpperCase()

    // Expected answer is K0X-17 (also accepting standard flag wrapper if submitted)
    if (upper === "K0X-17" || upper === "KERNEL0X{K0X-17}") {
      if (!isStage1Solved) {
        const nextSolved = [...solvedChallenges, "stage1"]
        setSolvedChallenges(nextSolved)
        setPoints((prev) => prev + 150)
      }
      setSubmissionStatus({
        type: "success",
        msg: "Correct! You found the first lead.",
      })
      setFlagInput("")
    } else {
      setSubmissionStatus({
        type: "error",
        msg: "Incorrect. Follow the evidence and try again.",
      })
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#070907] text-white font-sans selection:bg-[#9dff1f] selection:text-black">
      {/* Top Cyber Command Bar */}
      <header className="border-b border-[#9dff1f]/30 bg-[#0a0d0a]/95 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="font-heading text-2xl tracking-wider text-white hover:text-[#9dff1f] transition-colors"
            >
              KERNEL<span className="text-[#9dff1f]">0X</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 border-l border-[#1c231d] pl-4 text-xs font-mono text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-[#9dff1f] animate-ping" />
              <span>LIVE CTF EVENT PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 bg-[#121811] border border-[#9dff1f]/40 px-3 py-1.5 rounded-none font-mono text-xs">
              <Flame className="w-4 h-4 text-[#9dff1f]" />
              <span className="text-gray-400">SCORE:</span>
              <span className="text-[#9dff1f] font-bold text-sm">{points} PTS</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block font-mono text-xs">
                <div className="text-white font-semibold flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9dff1f]" />
                  <span>{user?.username || "OPERATIVE"}</span>
                </div>
                <div className="text-gray-500 text-[10px]">
                  {user?.teamName ? `TEAM: ${user.teamName}` : "SOLO OPERATIVE"}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-[#141a13] hover:bg-red-950/60 border border-[#1c231d] hover:border-red-500/50 text-gray-400 hover:text-red-400 px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer"
                title="Sign out of CTF"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">DISCONNECT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main CTF Arena */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Operative Welcome & Event Status Banner */}
        <div className="relative bg-[#0d120d] border border-[#9dff1f]/30 p-6 md:p-8 mb-8 overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#9dff1f]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 font-mono text-xs text-[#9dff1f]">
                <Terminal className="w-4 h-4" />
                <span>&gt; ACCESS_GRANTED // SECURITY CLEARANCE: VERIFIED PARTICIPANT</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl text-white tracking-wide">
                OPERATIVE: {user?.username?.toUpperCase() || "AGENT_01"}
              </h1>
              <p className="text-gray-400 text-sm max-w-2xl font-mono mt-2">
                Welcome to the active Kernel0X CTF competition arena. Your credentials have been verified through secure email token handshake.
                Stage 01 (OSINT) is currently unlocked and live for submission.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs shrink-0">
              <div className="bg-[#121811] p-3 border border-[#1c231d]">
                <span className="text-gray-500 block text-[10px]">CURRENT RANK</span>
                <span className="text-[#9dff1f] font-bold text-lg">#04</span>
              </div>
              <div className="bg-[#121811] p-3 border border-[#1c231d]">
                <span className="text-gray-500 block text-[10px]">TIME REMAINING</span>
                <span className="text-white font-bold text-lg">23:42:15</span>
              </div>
              <div className="bg-[#121811] p-3 border border-[#1c231d] col-span-2 sm:col-span-1">
                <span className="text-gray-500 block text-[10px]">STAGE STATUS</span>
                <span className="text-[#9dff1f] font-bold text-lg">
                  {isStage1Solved ? "STAGE 1 SOLVED" : "STAGE 1 ACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1c231d] mb-6 font-mono text-xs">
          {/* Stage 1 Tab */}
          <button
            onClick={() => setActiveTab("stage1")}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "stage1"
                ? "border-[#9dff1f] text-[#9dff1f] bg-[#10150e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {isStage1Solved ? (
              <Check className="w-3.5 h-3.5 text-[#9dff1f]" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-[#9dff1f]" />
            )}
            <span>STAGE 01: OSINT {isStage1Solved ? "(SOLVED)" : "(ACTIVE)"}</span>
          </button>

          {/* Stage 2 Tab (Connected to Stage 1 Unlock) */}
          <button
            onClick={() => setActiveTab("stage2")}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "stage2"
                ? "border-[#9dff1f] text-[#9dff1f] bg-[#10150e]"
                : isStage2Unlocked
                ? "border-transparent text-gray-300 hover:text-[#9dff1f]"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {isStage2Unlocked ? (
              <Unlock className="w-3.5 h-3.5 text-[#9dff1f]" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>STAGE 02: STEGANOGRAPHY {isStage2Unlocked ? "(UNLOCKED)" : "(LOCKED)"}</span>
          </button>

          {/* Stage 3 Tab (Preserved) */}
          <button
            onClick={() => setActiveTab("stage3")}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "stage3"
                ? "border-[#9dff1f] text-[#9dff1f] bg-[#10150e]"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>STAGE 03: CRYPTOGRAPHY</span>
          </button>

          {/* Stage 4 Tab (Preserved) */}
          <button
            onClick={() => setActiveTab("stage4")}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "stage4"
                ? "border-[#9dff1f] text-[#9dff1f] bg-[#10150e]"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>STAGE 04: NETWORK</span>
          </button>
        </div>

        {/* Submission Feedback Toast */}
        {submissionStatus && (
          <div
            className={`mb-6 p-4 border font-mono text-xs flex items-center justify-between ${
              submissionStatus.type === "success"
                ? "bg-[#9dff1f]/10 border-[#9dff1f] text-[#9dff1f]"
                : "bg-red-950/40 border-red-500 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {submissionStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-[#9dff1f]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{submissionStatus.msg}</span>
            </div>
            <button
              onClick={() => setSubmissionStatus(null)}
              className="text-xs underline ml-4 hover:opacity-80 cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* STAGE 1: OSINT / THE FIRST LEAD */}
        {activeTab === "stage1" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Challenge Mission Brief & Answer Submission */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mission Briefing Card */}
              <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8">
                {/* Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#1c231d]">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                    <Compass className="w-4 h-4" />
                    <span>CATEGORY: OSINT / RECONNAISSANCE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400">
                      DIFFICULTY: <strong className="text-white">EASY</strong>
                    </span>
                    <span className="bg-[#9dff1f]/20 text-[#9dff1f] font-mono text-xs px-2.5 py-0.5 font-bold">
                      150 PTS
                    </span>
                  </div>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl text-white mb-4 tracking-wide">
                  STAGE 1 — THE FIRST LEAD
                </h2>

                {/* Scenario Description */}
                <div className="space-y-3 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  <p>
                    NexaLabs has identified suspicious activity surrounding its public e-commerce development project.
                  </p>
                  <p>
                    The security team believes the activity may have left traces in publicly available developer information.
                  </p>
                  <p>
                    Your task is to identify the developer associated with the suspicious activity and investigate the available public project history.
                  </p>
                  <p className="text-gray-400 italic">
                    Do not assume the first result is the answer. Follow the evidence.
                  </p>
                </div>

                {/* Initial Clue Banner */}
                <div className="p-4 bg-[#070907] border-l-2 border-[#9dff1f] border-y border-r border-[#1c231d] font-mono text-xs mb-6">
                  <span className="text-[#9dff1f] font-bold block mb-1">&gt; INITIAL LEAD:</span>
                  <p className="text-white font-semibold">
                    "NexaLabs maintains an online development presence."
                  </p>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Investigate NexaLabs using your web browser and open-source intelligence techniques.
                  </p>
                </div>

                {/* Download Investigation Brief CTA */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-[#111610] border border-[#9dff1f]/30 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold mb-1">
                      <FileText className="w-4 h-4 text-[#9dff1f]" />
                      <span>INVESTIGATION BRIEF</span>
                    </div>
                    <p className="font-mono text-gray-400 text-xs">
                      Official security investigation dossier file: <code className="text-[#9dff1f]">investigator-brief.txt</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBrief}
                    className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-5 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD BRIEF</span>
                  </button>
                </div>

                {/* Progressive Hints Section */}
                <div className="border border-[#1c231d] bg-[#070907] p-4 sm:p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                      <HelpCircle className="w-4 h-4" />
                      <span>INVESTIGATION HINTS (PROGRESSIVE)</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">2 HINTS AVAILABLE</span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    {/* Hint 1 */}
                    <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-semibold">// HINT 01</span>
                        <button
                          type="button"
                          onClick={() => setHint1Revealed(!hint1Revealed)}
                          className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                        >
                          {hint1Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 1 ]"}
                        </button>
                      </div>
                      {hint1Revealed && (
                        <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                          "Check where developers leave traces."
                        </p>
                      )}
                    </div>

                    {/* Hint 2 */}
                    <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-semibold">// HINT 02</span>
                        <button
                          type="button"
                          onClick={() => setHint2Revealed(!hint2Revealed)}
                          className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                        >
                          {hint2Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 2 ]"}
                        </button>
                      </div>
                      {hint2Revealed && (
                        <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                          "Metadata often says more than the file itself."
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer Submission Form */}
                <div className="pt-4 border-t border-[#1c231d]">
                  {isStage1Solved && (
                    <div className="mb-4 p-3 bg-[#9dff1f]/10 border border-[#9dff1f]/50 flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                      <CheckCircle className="w-4 h-4 shrink-0 text-[#9dff1f]" />
                      <span>STAGE 1 SOLVED — Stage 2 Steganography has been unlocked!</span>
                    </div>
                  )}

                  <form onSubmit={handleFlagSubmit} className="space-y-3">
                    <label className="block font-mono text-xs text-gray-400 font-semibold">
                      SUBMIT STAGE 1 ANSWER / LEAD CODE:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Flag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={flagInput}
                          onChange={(e) => setFlagInput(e.target.value)}
                          placeholder="Enter discovered lead / clue code..."
                          className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-[#9dff1f] pl-10 pr-3 py-2.5 font-mono text-sm outline-none transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                      >
                        <span>SUBMIT ANSWER</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column: Live Event Leaderboard & Guidelines */}
            <div className="space-y-6">
              <div className="bg-[#0e120e] border border-[#1c231d] p-6">
                <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f] mb-4">
                  <Award className="w-4 h-4" />
                  <span>TOP OPERATIVES LEADERBOARD</span>
                </div>

                <div className="divide-y divide-[#1c231d] font-mono text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-[#9dff1f] font-bold">#1 0xCyph3r</span>
                    <span className="text-white">600 PTS</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-gray-300 font-bold">#2 NullPointer</span>
                    <span className="text-white">450 PTS</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-gray-400 font-bold">#3 BitShift</span>
                    <span className="text-white">300 PTS</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between bg-[#141c12] px-2 -mx-2 border border-[#9dff1f]/30">
                    <span className="text-[#9dff1f] font-bold">#4 {user?.username || "You"} (YOU)</span>
                    <span className="text-[#9dff1f] font-bold">{points} PTS</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-gray-500 font-bold">#5 GhostKernel</span>
                    <span className="text-white">0 PTS</span>
                  </div>
                </div>
              </div>

              {/* Rules / Support card */}
              <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                <div className="text-[#9dff1f] font-bold mb-3">// INVESTIGATION RULES:</div>
                <ul className="text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                  <li>Use open-source intelligence tools and public search engines.</li>
                  <li>Do not assume the first result is the answer. Follow the evidence.</li>
                  <li>Automated scraping or brute-force scanning of platforms is strictly prohibited.</li>
                  <li>Submit your discovered lead code directly in the answer box.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: STEGANOGRAPHY (CONNECTED TO STAGE 1 UNLOCK) */}
        {activeTab === "stage2" && (
          <div>
            {!isStage2Unlocked ? (
              /* Before Stage 1 completion: Locked state */
              <div className="bg-[#0e120e] border border-[#1c231d] p-12 text-center max-w-2xl mx-auto">
                <Lock className="w-12 h-12 text-[#9dff1f]/40 mx-auto mb-4" />
                <div className="font-mono text-xs text-gray-500 mb-2">// CHALLENGE ACCESS RESTRICTED</div>
                <h2 className="font-heading text-3xl text-white mb-2">STAGE 2 🔒 LOCKED</h2>
                <p className="font-mono text-sm text-gray-400 mb-6">
                  Complete Stage 1 to unlock this challenge.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("stage1")}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                >
                  RETURN TO STAGE 1
                </button>
              </div>
            ) : (
              /* After submitting K0X-17 correctly: Unlocked state */
              <div className="bg-[#0e120e] border border-[#9dff1f]/40 p-8 sm:p-10 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1c231d]">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                    <Unlock className="w-4 h-4 text-[#9dff1f]" />
                    <span>STAGE 2 🔓 UNLOCKED // SECURITY CLEARANCE GRANTED</span>
                  </div>
                  <span className="bg-[#9dff1f]/20 text-[#9dff1f] font-mono text-xs px-2.5 py-0.5 font-bold">
                    UNLOCKED
                  </span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3">
                  STAGE 2: STEGANOGRAPHY
                </h2>
                <p className="font-mono text-sm text-gray-300 leading-relaxed mb-6">
                  Access Granted. You have verified the first lead from Stage 1. 
                  The Stage 2 Steganography payload investigation challenge is now open.
                </p>

                <div className="p-4 bg-[#070907] border border-[#1c231d] font-mono text-xs text-gray-400 space-y-2">
                  <div className="text-[#9dff1f] font-semibold">&gt; STATUS REPORT:</div>
                  <div>* Lead verified: Stage 1 OSINT trace confirmed</div>
                  <div>* Target asset: Awaiting payload extraction</div>
                  <div>* Difficulty: Intermediate</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGES 3, 4: PRESERVED AS LOCKED STAGES */}
        {activeTab !== "stage1" && activeTab !== "stage2" && (
          <div className="bg-[#0e120e] border border-[#1c231d] p-12 text-center max-w-2xl mx-auto">
            <Lock className="w-12 h-12 text-[#9dff1f]/40 mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-white mb-2">STAGE LOCKED // CLASSIFIED ACCESS</h2>
            <p className="font-mono text-sm text-gray-400 max-w-md mx-auto mb-6">
              This stage has not yet reached its unlock timestamp. Return to active stages to collect eligible points.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("stage1")}
              className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
            >
              RETURN TO STAGE 01: OSINT
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
