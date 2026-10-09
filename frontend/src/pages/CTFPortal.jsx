import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
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
  Check,
  RotateCcw,
  Search,
  Copy,
  Sparkles,
  Trophy,
  X,
  Key
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useSearch } from "@/context/SearchContext"

export default function CTFPortal() {
  const { user, logout } = useAuth()
  const { openSearch } = useSearch()
  const navigate = useNavigate()

  // Flag submission states
  const [flagInput, setFlagInput] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [activeTab, setActiveTab] = useState("stage1")

  // User-scoped CTF progress
  const [solvedChallenges, setSolvedChallenges] = useState([])
  const [points, setPoints] = useState(0)

  // Live server-synced leaderboard + time-based XP state
  const [liveLeaderboard, setLiveLeaderboard] = useState([])
  const [myEntry, setMyEntry] = useState(null)
  const [scoring, setScoring] = useState({ baseXp: 100, bonusXp: 100, decaySeconds: 3600 })
  const [stageStartedAt, setStageStartedAt] = useState(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  // Progressive hints
  const [hint1Revealed, setHint1Revealed] = useState(false)
  const [hint2Revealed, setHint2Revealed] = useState(false)
  const [stage2Hint1Revealed, setStage2Hint1Revealed] = useState(false)
  const [stage2Hint2Revealed, setStage2Hint2Revealed] = useState(false)
  const [stage3Hint1Revealed, setStage3Hint1Revealed] = useState(false)
  const [stage3Hint2Revealed, setStage3Hint2Revealed] = useState(false)
  const [stage4Hint1Revealed, setStage4Hint1Revealed] = useState(false)
  const [stage4Hint2Revealed, setStage4Hint2Revealed] = useState(false)
  const [stage4Hint3Revealed, setStage4Hint3Revealed] = useState(false)
  const [stage4Hint4Revealed, setStage4Hint4Revealed] = useState(false)
  const [stage5Hint1Revealed, setStage5Hint1Revealed] = useState(false)
  const [stage5Hint2Revealed, setStage5Hint2Revealed] = useState(false)
  const [stage5Hint3Revealed, setStage5Hint3Revealed] = useState(false)
  const [stage6Hint1Revealed, setStage6Hint1Revealed] = useState(false)
  const [stage6Hint2Revealed, setStage6Hint2Revealed] = useState(false)
  const [stage6Hint3Revealed, setStage6Hint3Revealed] = useState(false)
  const [stage6Hint4Revealed, setStage6Hint4Revealed] = useState(false)
  const [stage6Hint5Revealed, setStage6Hint5Revealed] = useState(false)
  const [stage6Hint6Revealed, setStage6Hint6Revealed] = useState(false)
  const [copiedSshCmd, setCopiedSshCmd] = useState(false)
  const [showCelebrationModal, setShowCelebrationModal] = useState(false)
  const [puzzleKeyGuess, setPuzzleKeyGuess] = useState("")
  const [copiedKey, setCopiedKey] = useState(false)

  // Status flags
  const isStage1Solved = solvedChallenges.includes("stage1")
  const isStage2Unlocked = isStage1Solved
  const isStage2Solved = solvedChallenges.includes("stage2")
  const isStage3Unlocked = isStage2Solved
  const isStage3Solved = solvedChallenges.includes("stage3")
  const isStage4Unlocked = isStage3Solved
  const isStage4Solved = solvedChallenges.includes("stage4")
  const isStage5Unlocked = isStage4Solved
  const isStage5Solved = solvedChallenges.includes("stage5")
  const isStage6Unlocked = isStage5Solved
  const isStage6Solved = solvedChallenges.includes("stage6")

  // Stage 4 -> Stage 5 dynamic ciphertext passing
  const [stage4Ciphertext, setStage4Ciphertext] = useState(() => {
    try {
      return localStorage.getItem("kernel0x_stage4_ciphertext") || ""
    } catch (e) {
      return ""
    }
  })
  const [copiedCiphertext, setCopiedCiphertext] = useState(false)

  // Fetch operative's progress from backend database on login or user switch
  useEffect(() => {
    // Clear legacy shared global localStorage
    try {
      localStorage.removeItem("kernel0x_solved_stages")
      localStorage.removeItem("kernel0x_points")
    } catch (e) {}

    if (!user) {
      setSolvedChallenges([])
      setPoints(0)
      return
    }

    async function loadProgress() {
      try {
        const token = localStorage.getItem("kernel0x_token")
        if (!token) return

        const res = await axios.get("/api/ctf/progress", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.data.success) {
          setSolvedChallenges(res.data.solvedStages || [])
          setPoints(res.data.points || 0)
          if (res.data.scoring) setScoring(res.data.scoring)
          setStageStartedAt(res.data.currentStageStartedAt || null)
          if (res.data.stage4Ciphertext) {
            setStage4Ciphertext(res.data.stage4Ciphertext)
            localStorage.setItem("kernel0x_stage4_ciphertext", res.data.stage4Ciphertext)
          }
        }
      } catch (err) {
        console.error("[CTF] Failed to load user progress:", err)
      }
    }

    loadProgress()
    fetchLeaderboard()

    // Live leaderboard: poll every 5s; local clock ticks every second
    const pollId = setInterval(fetchLeaderboard, 5000)
    const tickId = setInterval(() => setNowMs(Date.now()), 1000)
    return () => {
      clearInterval(pollId)
      clearInterval(tickId)
    }
  }, [user?.id])

  // Fetch latest global leaderboard from backend (real operatives only)
  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("kernel0x_token")
    if (!token) return
    try {
      const res = await axios.get("/api/ctf/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data?.success && Array.isArray(res.data.leaderboard)) {
        setLiveLeaderboard(res.data.leaderboard)
        setMyEntry(res.data.you || null)
      }
    } catch (err) {
      // keep last known board on transient errors
    }
  }

  const formatDuration = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds || 0))
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const pad = (n) => String(n).padStart(2, "0")
    return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
  }

  // Live elapsed time on the active stage and the XP it would currently award
  const stageElapsedSeconds = stageStartedAt
    ? Math.max(0, (nowMs - new Date(stageStartedAt).getTime()) / 1000)
    : 0
  const liveStageXp =
    scoring.baseXp +
    Math.round(Math.max(0, scoring.bonusXp * (1 - stageElapsedSeconds / scoring.decaySeconds)))

  const currentUserRank = myEntry?.rank || liveLeaderboard.length + 1 || 1

  // Top 5, plus the current operative's row if they're outside the top 5
  const displayedOperatives = useMemo(() => {
    const top = liveLeaderboard.slice(0, 5)
    if (myEntry && !top.some((op) => op.isYou)) {
      return [...top.slice(0, 4), myEntry]
    }
    return top
  }, [liveLeaderboard, myEntry])

  const renderLeaderboard = () => (
    <div className="bg-[#0e120e] border border-[#1c231d] p-6">
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#9dff1f] mb-4">
        <span className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>TOP OPERATIVES LEADERBOARD</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9dff1f] animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="divide-y divide-[#1c231d] font-mono text-xs">
        {displayedOperatives.length === 0 && (
          <div className="py-3 text-gray-500">Syncing operatives...</div>
        )}
        {displayedOperatives.map((op) => (
          <div
            key={op.id}
            className={`py-2.5 flex items-center justify-between gap-2 ${
              op.isYou ? "bg-[#141c12] px-2 -mx-2 border border-[#9dff1f]/30" : ""
            }`}
          >
            <span
              className={`font-bold truncate ${
                op.isYou || op.rank === 1
                  ? "text-[#9dff1f]"
                  : op.rank === 2
                  ? "text-gray-300"
                  : op.rank === 3
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              #{op.rank} {op.username} {op.isYou ? "(YOU)" : ""}
            </span>
            <span className="text-right shrink-0">
              <span className={op.isYou ? "text-[#9dff1f] font-bold" : "text-white"}>
                {op.points} XP
              </span>
              {op.solvedCount > 0 && (
                <span className="block text-[10px] text-gray-500">
                  {op.solvedCount} stage{op.solvedCount > 1 ? "s" : ""} · {formatDuration(op.totalSeconds)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  // Download investigation brief file
  const handleDownloadBrief = () => {
    const briefContent = `NexaLabs Security Investigation

NexaLabs has identified suspicious activity connected to its public development footprint. The security team believes that traces left by a developer may help identify the first lead in the investigation.

Initial Lead:
"NexaLabs maintains an online development presence, including a recently developed e-commerce project."

Player task:
Identify the developer associated with the suspicious activity and investigate the available public project history.

Investigation instructions:
- Search for NexaLabs' public development presence.
- Locate the relevant e-commerce project.
- Review its public commit history.
- Distinguish normal development activity from suspicious activity.
- Investigate files added by the suspicious developer.
- Examine relevant file metadata for the hidden clue.

Useful tools:
- Web browser
- GitHub Search
- ExifTool
- WHOIS

Do not assume the first result is the answer. Follow the evidence.`

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

  // Handle answer submission via server API
  const handleFlagSubmit = async (e, stageToSubmit = activeTab) => {
    e.preventDefault()
    if (!flagInput.trim()) return

    const token = localStorage.getItem("kernel0x_token")
    if (!token) {
      setSubmissionStatus({
        type: "error",
        msg: "Session expired. Please sign in again.",
      })
      return
    }

    try {
      const res = await axios.post(
        "/api/ctf/submit",
        {
          stage: stageToSubmit,
          flag: flagInput.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.data.success) {
        setSolvedChallenges(res.data.solvedStages || [])
        setPoints(res.data.points || 0)
        setStageStartedAt(res.data.currentStageStartedAt || null)
        setSubmissionStatus({
          type: "success",
          msg: res.data.message || "Correct! Flag confirmed.",
        })
        if (stageToSubmit === "stage4") {
          const cipher = res.data.ciphertext || flagInput.trim()
          setStage4Ciphertext(cipher)
          localStorage.setItem("kernel0x_stage4_ciphertext", cipher)
        }
        if (stageToSubmit === "stage6") {
          setShowCelebrationModal(true)
        }
        setFlagInput("")
        fetchLeaderboard()
      }
    } catch (err) {
      setSubmissionStatus({
        type: "error",
        msg: err.response?.data?.message || "Incorrect. Follow the evidence and try again.",
      })
    }
  }

  // Reset progress for a specific stage or all stages (useful for re-testing)
  const handleResetStage = async (stageId = "stage1") => {
    const token = localStorage.getItem("kernel0x_token")
    if (!token) return

    try {
      const res = await axios.post(
        "/api/ctf/reset",
        { stage: stageId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.data.success) {
        const newSolved = res.data.solvedStages || []
        setSolvedChallenges(newSolved)
        setPoints(res.data.points || 0)
        setFlagInput("")

        if (!newSolved.includes("stage4")) {
          setStage4Ciphertext("")
          localStorage.removeItem("kernel0x_stage4_ciphertext")
        }

        const stageLabel = stageId.replace(/^stage(\d+)$/i, "Stage $1")
        setSubmissionStatus({
          type: "success",
          msg: res.data.message || `Progress reset for your operative account. ${stageLabel} is now active.`,
        })

        if (res.data.currentStageStartedAt) {
          setStageStartedAt(res.data.currentStageStartedAt)
        } else {
          try {
            const prog = await axios.get("/api/ctf/progress", {
              headers: { Authorization: `Bearer ${token}` },
            })
            setStageStartedAt(prog.data?.currentStageStartedAt || null)
          } catch (e) {}
        }
        fetchLeaderboard()
      }
    } catch (err) {
      console.error("[CTF Reset Error]", err)
      setSubmissionStatus({
        type: "error",
        msg: err.response?.data?.message || "Error resetting stage progress.",
      })
    }
  }

  const handleResetProgress = () => handleResetStage("stage1")

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

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={openSearch}
              className="flex items-center gap-2 bg-[#121811] hover:bg-[#182117] border border-[#1c231d] hover:border-[#9dff1f]/50 px-2.5 py-1.5 font-mono text-xs text-gray-300 hover:text-[#9dff1f] transition-all cursor-pointer"
              title="Search CTF Matrix [Ctrl+K]"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEARCH</span>
              <kbd className="hidden lg:inline text-[10px] text-gray-500 bg-[#070907] px-1 border border-[#1c231d]">
                Ctrl K
              </kbd>
            </button>

            <div className="flex items-center gap-2 bg-[#121811] border border-[#9dff1f]/40 px-3 py-1.5 rounded-none font-mono text-xs">
              <Flame className="w-4 h-4 text-[#9dff1f]" />
              <span className="text-gray-400">SCORE:</span>
              <span className="text-[#9dff1f] font-bold text-sm">{points} XP</span>
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
                <span className="text-[#9dff1f] font-bold text-lg">
                  #{String(currentUserRank).padStart(2, "0")}
                </span>
              </div>
              <div className="bg-[#121811] p-3 border border-[#1c231d]">
                <span className="text-gray-500 block text-[10px]">STAGE TIMER // XP NOW</span>
                <span className="text-white font-bold text-lg">
                  {stageStartedAt && !isStage5Solved
                    ? `${formatDuration(stageElapsedSeconds)} · ${liveStageXp} XP`
                    : "—"}
                </span>
              </div>
              <div className="bg-[#121811] p-3 border border-[#1c231d] col-span-2 sm:col-span-1">
                <span className="text-gray-500 block text-[10px]">STAGE STATUS</span>
                <span className="text-[#9dff1f] font-bold text-lg">
                  {isStage6Solved
                    ? "STAGE 6 SOLVED"
                    : isStage5Solved
                    ? "STAGE 6 ACTIVE"
                    : isStage4Solved
                    ? "STAGE 5 ACTIVE"
                    : isStage3Solved
                    ? "STAGE 4 ACTIVE"
                    : isStage2Solved
                    ? "STAGE 3 ACTIVE"
                    : isStage1Solved
                    ? "STAGE 2 ACTIVE"
                    : "STAGE 1 ACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Selector Tactical Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 mb-6">
          {[
            {
              id: "stage1",
              num: "01",
              name: "OSINT",
              domain: "RECON",
              isSolved: isStage1Solved,
              isUnlocked: true,
            },
            {
              id: "stage2",
              num: "02",
              name: "STEGANO",
              domain: "CARRIER",
              isSolved: isStage2Solved,
              isUnlocked: isStage2Unlocked,
            },
            {
              id: "stage3",
              num: "03",
              name: "CRYPTO",
              domain: "CIPHER",
              isSolved: isStage3Solved,
              isUnlocked: isStage3Unlocked,
            },
            {
              id: "stage4",
              num: "04",
              name: "NETWORK",
              domain: "PCAP",
              isSolved: isStage4Solved,
              isUnlocked: isStage4Unlocked,
            },
            {
              id: "stage5",
              num: "05",
              name: "CIPHER II",
              domain: "VIGENÈRE",
              isSolved: isStage5Solved,
              isUnlocked: isStage5Unlocked,
            },
            {
              id: "stage6",
              num: "06",
              name: "LIVE SYS",
              domain: "CONTAINER",
              isSolved: isStage6Solved,
              isUnlocked: isStage6Unlocked,
            },
          ].map((stg) => {
            const isActive = activeTab === stg.id

            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => {
                  setActiveTab(stg.id)
                  setFlagInput("")
                  setSubmissionStatus(null)
                }}
                className={`p-3 text-left font-mono transition-all relative cursor-pointer border flex flex-col justify-between min-h-[76px] sm:min-h-[82px] group ${
                  isActive
                    ? "bg-[#11190f] border-[#9dff1f] shadow-[0_0_15px_rgba(157,255,31,0.18)]"
                    : stg.isSolved
                    ? "bg-[#0b120a] border-[#9dff1f]/30 hover:border-[#9dff1f]/70 text-white"
                    : stg.isUnlocked
                    ? "bg-[#0a0e0a] border-[#1c231d] hover:border-[#9dff1f]/40 text-gray-300"
                    : "bg-[#070907] border-[#161a16] text-gray-600 hover:border-gray-700 hover:text-gray-400"
                }`}
              >
                {/* Active neon highlight bar at top */}
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#9dff1f] shadow-[0_0_8px_#9dff1f]" />
                )}

                {/* Top Row: STAGE XX + Status Icon/Pill */}
                <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                  <span
                    className={`text-[10px] font-bold tracking-wider ${
                      isActive
                        ? "text-[#9dff1f]"
                        : stg.isSolved
                        ? "text-[#9dff1f]"
                        : stg.isUnlocked
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    STAGE {stg.num}
                  </span>

                  <span className="flex items-center gap-1 text-[10px]">
                    {stg.isSolved ? (
                      <span className="text-[#9dff1f] flex items-center gap-0.5 font-bold">
                        <Check className="w-3 h-3" />
                        <span className="hidden xl:inline">SOLVED</span>
                      </span>
                    ) : isActive ? (
                      <span className="text-[#9dff1f] flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9dff1f] animate-pulse" />
                        <span>ACTIVE</span>
                      </span>
                    ) : stg.isUnlocked ? (
                      <span className="text-gray-400 flex items-center gap-0.5">
                        <Unlock className="w-3 h-3 text-[#9dff1f]/60" />
                        <span className="hidden xl:inline">OPEN</span>
                      </span>
                    ) : (
                      <span className="text-gray-600 flex items-center gap-0.5">
                        <Lock className="w-3 h-3" />
                        <span className="hidden xl:inline">LOCKED</span>
                      </span>
                    )}
                  </span>
                </div>

                {/* Bottom: Challenge Title & Domain */}
                <div className="w-full">
                  <div
                    className={`font-heading text-xs sm:text-sm font-bold tracking-wide truncate ${
                      isActive
                        ? "text-white"
                        : stg.isSolved
                        ? "text-gray-200"
                        : stg.isUnlocked
                        ? "text-gray-300 group-hover:text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {stg.name}
                  </div>
                  <div
                    className={`text-[9px] font-mono tracking-wider truncate uppercase ${
                      isActive
                        ? "text-[#9dff1f]"
                        : stg.isSolved
                        ? "text-emerald-500/80"
                        : "text-gray-500"
                    }`}
                  >
                    // {stg.domain}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Submission Feedback Toast */}
        {submissionStatus && (
          <div
            className={`mb-6 p-4 border font-mono text-xs flex items-start justify-between ${
              submissionStatus.type === "success"
                ? "bg-[#9dff1f]/10 border-[#9dff1f] text-[#9dff1f]"
                : "bg-red-950/40 border-red-500 text-red-400"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {submissionStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-[#9dff1f] mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <div className="whitespace-pre-line leading-relaxed font-semibold">
                {submissionStatus.msg}
              </div>
            </div>
            <button
              onClick={() => setSubmissionStatus(null)}
              className="text-xs underline ml-4 hover:opacity-80 cursor-pointer shrink-0"
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
                    NexaLabs has identified suspicious activity connected to its public development footprint. The security team believes that traces left by a developer may help identify the first lead in the investigation.
                  </p>
                  <p>
                    <strong className="text-white">Player task:</strong> Identify the developer associated with the suspicious activity and investigate the available public project history.
                  </p>
                  <p className="text-gray-400 italic">
                    Do not assume the first result is the answer. Follow the evidence.
                  </p>
                </div>

                {/* Initial Clue Banner */}
                <div className="p-4 bg-[#070907] border-l-2 border-[#9dff1f] border-y border-r border-[#1c231d] font-mono text-xs mb-6">
                  <span className="text-[#9dff1f] font-bold block mb-1">&gt; INITIAL LEAD:</span>
                  <p className="text-white font-semibold">
                    "NexaLabs maintains an online development presence, including a recently developed e-commerce project."
                  </p>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Investigate NexaLabs using your web browser and open-source intelligence techniques.
                  </p>
                </div>

                {/* Investigation Instructions & Tools */}
                <div className="p-4 bg-[#070907] border border-[#1c231d] font-mono text-xs mb-6 space-y-4">
                  <div>
                    <span className="text-[#9dff1f] font-bold block mb-2">&gt; INVESTIGATION INSTRUCTIONS:</span>
                    <ul className="space-y-1.5 text-gray-300 list-disc list-inside">
                      <li>Search for NexaLabs' public development presence.</li>
                      <li>Locate the relevant e-commerce project.</li>
                      <li>Review its public commit history.</li>
                      <li>Distinguish normal development activity from suspicious activity.</li>
                      <li>Investigate files added by the suspicious developer.</li>
                      <li>Examine relevant file metadata for the hidden clue.</li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#1c231d]">
                    <span className="text-gray-400 block mb-2 font-semibold">USEFUL TOOLS:</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-[#101610] border border-[#1c231d] text-[#9dff1f] text-[11px]">Web browser</span>
                      <span className="px-2.5 py-1 bg-[#101610] border border-[#1c231d] text-[#9dff1f] text-[11px]">GitHub Search</span>
                      <span className="px-2.5 py-1 bg-[#101610] border border-[#1c231d] text-[#9dff1f] text-[11px]">ExifTool</span>
                      <span className="px-2.5 py-1 bg-[#101610] border border-[#1c231d] text-[#9dff1f] text-[11px]">WHOIS</span>
                    </div>
                  </div>
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
                    <div className="mb-6 p-4 sm:p-5 bg-[#9dff1f]/10 border-2 border-[#9dff1f] font-mono text-xs text-[#9dff1f] space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#9dff1f]/30">
                        <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#9dff1f]">
                          <CheckCircle className="w-5 h-5 shrink-0 text-[#9dff1f]" />
                          <span>STAGE 1 SOLVED — THE FIRST LEAD CONFIRMED</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setActiveTab("stage2"); setFlagInput(""); setSubmissionStatus(null); }}
                            className="text-[11px] bg-[#9dff1f] text-black px-2.5 py-1 font-bold hover:bg-[#b0ff42] cursor-pointer"
                          >
                            PROCEED TO STAGE 2 &rarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetStage("stage1")}
                            className="text-[11px] text-gray-400 hover:text-red-400 underline cursor-pointer ml-2"
                            title="Reset progress to re-test this stage"
                          >
                            [ RESET ]
                          </button>
                        </div>
                      </div>
                      <p className="text-white text-xs">
                        You successfully identified the hidden deployment clue.
                      </p>
                      <div className="py-1 px-2.5 bg-[#0a0f0a] border border-[#9dff1f]/40 text-white font-bold inline-block">
                        Clue recovered: <span className="text-[#9dff1f]">K0X-17</span>
                      </div>
                      <p className="text-gray-300 text-xs">
                        This clue is required for the next stage.
                      </p>
                      <p className="text-[#9dff1f] font-bold text-xs pt-1">
                        Stage 2 — Hidden in Plain Sight has been unlocked.
                      </p>
                    </div>
                  )}

                  {!isStage1Solved && (
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
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Event Leaderboard & Guidelines */}
            <div className="space-y-6">
              {renderLeaderboard()}

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

        {/* STAGE 2: HIDDEN IN PLAIN SIGHT (STEGANOGRAPHY) */}
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
              /* Unlocked Stage 2 View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Challenge Mission Brief & Answer Submission */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8">
                    {/* Header Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#1c231d]">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                        <Flame className="w-4 h-4" />
                        <span>CATEGORY: STEGANOGRAPHY</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-400">
                          DIFFICULTY: <strong className="text-white">MEDIUM</strong>
                        </span>
                        <span className="bg-[#9dff1f]/20 text-[#9dff1f] font-mono text-xs px-2.5 py-0.5 font-bold">
                          150 PTS
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl text-white mb-4 tracking-wide">
                      STAGE 2 — HIDDEN IN PLAIN SIGHT
                    </h2>

                    {/* Storyline / Scenario */}
                    <div className="space-y-3 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                      <p>
                        The First Lead has been confirmed.
                      </p>
                      <p>
                        The access code K0X-17 was recovered from the metadata of a suspicious deployment asset associated with Daniel Perera.
                      </p>
                      <p>
                        During the investigation of the e-commerce project, another image from the same suspicious deployment commit attracts attention: <span className="text-white font-semibold">hero-banner.jpg</span>.
                      </p>
                      <p>
                        At first glance, it appears to be an ordinary website image.
                      </p>
                      <p>
                        However, given the suspicious activity surrounding the project, the image should be treated as potentially containing hidden information.
                      </p>
                      <p>
                        Your task is to investigate the image and recover the hidden data.
                      </p>
                      <p className="text-gray-400">
                        The access code recovered from Stage 1 may be required.
                      </p>
                      <p className="text-amber-400/90 italic">
                        Important: the recovered data may not be immediately readable. Preserve the extracted text exactly.
                      </p>
                    </div>

                    {/* Carrier Image Artifact Download Card */}
                    <div className="p-4 bg-[#111610] border border-[#9dff1f]/30 mb-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-14 h-14 bg-[#070907] border border-[#1c231d] flex items-center justify-center shrink-0 overflow-hidden">
                            <img src="/hero-banner.jpg" alt="hero-banner" className="w-full h-full object-cover opacity-90" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold">
                              <FileText className="w-4 h-4 text-[#9dff1f]" />
                              <span>CARRIER ARTIFACT: hero-banner.jpg</span>
                            </div>
                            <p className="font-mono text-gray-400 text-xs mt-0.5">
                              Suspicious deployment asset: <code className="text-[#9dff1f]">hero-banner.jpg</code>
                            </p>
                          </div>
                        </div>
                        <a
                          href="/hero-banner.jpg"
                          download="hero-banner.jpg"
                          className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-5 py-2.5 flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                        >
                          <Download className="w-4 h-4" />
                          <span>DOWNLOAD IMAGE</span>
                        </a>
                      </div>
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
                              onClick={() => setStage2Hint1Revealed(!stage2Hint1Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage2Hint1Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 1 ]"}
                            </button>
                          </div>
                          {stage2Hint1Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The image may contain more than what you can see. Look for data hidden inside the file."
                            </p>
                          )}
                        </div>

                        {/* Hint 2 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 02</span>
                            <button
                              type="button"
                              onClick={() => setStage2Hint2Revealed(!stage2Hint2Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage2Hint2Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 2 ]"}
                            </button>
                          </div>
                          {stage2Hint2Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The access code recovered from the previous stage may be useful when extracting the hidden data."
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Solved Status & Answer Submission Form */}
                    <div className="pt-4 border-t border-[#1c231d]">
                      {isStage2Solved && (
                        <div className="mb-6 p-4 sm:p-5 bg-[#9dff1f]/10 border-2 border-[#9dff1f] font-mono text-xs text-[#9dff1f] space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-[#9dff1f]/30">
                            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#9dff1f]">
                              <CheckCircle className="w-5 h-5 shrink-0 text-[#9dff1f]" />
                              <span>STAGE 2 SOLVED — HIDDEN DATA RECOVERED</span>
                            </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setActiveTab("stage3"); setFlagInput(""); setSubmissionStatus(null); }}
                            className="text-[11px] bg-[#9dff1f] text-black px-2.5 py-1 font-bold hover:bg-[#b0ff42] cursor-pointer"
                          >
                            PROCEED TO STAGE 3 &rarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetStage("stage2")}
                            className="text-[11px] text-gray-400 hover:text-red-400 underline cursor-pointer ml-2"
                            title="Reset progress to re-test this stage"
                          >
                            [ RESET ]
                          </button>
                        </div>
                      </div>
                          <p className="text-white text-xs">
                            The image contained a concealed message.
                          </p>
                          <p className="text-gray-300 text-xs">
                            However, the recovered text is encrypted and cannot yet be understood.
                          </p>
                          <div className="py-1.5 px-3 bg-[#0a0f0a] border border-[#9dff1f]/40 text-white font-mono inline-block">
                            Recovered ciphertext: <span className="text-[#9dff1f] font-bold">Rlyuls0E&#123;jhlzhy_pz_jshzzpj&#125;</span>
                          </div>
                          <p className="text-gray-300 text-xs">
                            The message appears to use a simple classical cipher.
                          </p>
                          <p className="text-[#9dff1f] font-bold text-xs pt-1">
                            Stage 3 — The Encrypted Note has been unlocked.
                          </p>
                        </div>
                      )}

                      {!isStage2Solved && (
                        <form onSubmit={(e) => handleFlagSubmit(e, "stage2")} className="space-y-3">
                          <label className="block font-mono text-xs text-gray-400 font-semibold">
                            SUBMIT STAGE 2 EXTRACTED PAYLOAD:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Flag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                placeholder="Enter extracted hidden data / ciphertext..."
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
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Event Leaderboard & Guidelines */}
                <div className="space-y-6">
                  {renderLeaderboard()}

                  {/* Stage 2 Investigation Rules Card */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3">// STEGANOGRAPHY GUIDELINES:</div>
                    <ul className="text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Inspect carrier files carefully for concealed or embedded data.</li>
                      <li>Access codes recovered from previous stages may be required.</li>
                      <li>Do not assume extracted data is immediately readable. Preserve exact text.</li>
                      <li>Submit the raw extracted payload directly.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: THE ENCRYPTED NOTE (CRYPTOGRAPHY) */}
        {activeTab === "stage3" && (
          <div>
            {!isStage3Unlocked ? (
              /* Before Stage 2 completion: Locked state */
              <div className="bg-[#0e120e] border border-[#1c231d] p-12 text-center max-w-2xl mx-auto">
                <Lock className="w-12 h-12 text-[#9dff1f]/40 mx-auto mb-4" />
                <div className="font-mono text-xs text-gray-500 mb-2">// CHALLENGE ACCESS RESTRICTED</div>
                <h2 className="font-heading text-3xl text-white mb-2">STAGE 3 🔒 LOCKED</h2>
                <p className="font-mono text-sm text-gray-400 mb-6">
                  Complete Stage 2 to unlock this challenge.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("stage2")}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                >
                  RETURN TO STAGE 2
                </button>
              </div>
            ) : (
              /* Unlocked Stage 3 View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Challenge Mission Brief & Decryption Submission */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8">
                    {/* Header Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#1c231d]">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                        <Terminal className="w-4 h-4" />
                        <span>CATEGORY: CRYPTOGRAPHY</span>
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
                      STAGE 3 — THE ENCRYPTED NOTE
                    </h2>

                    {/* Storyline / Scenario */}
                    <div className="space-y-3 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                      <p>
                        The hidden message has been recovered, but it is encrypted.
                      </p>
                      <p>
                        The ciphertext does not appear to be random. Its structure suggests that Kernel0X used a simple classical substitution technique to conceal the note.
                      </p>
                      <p>
                        You already have everything you need from previous stages. The numbers in the Stage 1 clue (<span className="text-[#9dff1f] font-bold">K0X-17</span>) are needed to decode the cipher.
                      </p>
                      <p>
                        Decode the recovered ciphertext and uncover the message left by Kernel0X.
                      </p>
                      <p className="text-amber-400/90 font-semibold">
                        No new file is required for this stage.
                      </p>
                    </div>

                    {/* Recovered Ciphertext Banner (from Stage 2) */}
                    <div className="p-4 bg-[#070907] border-l-2 border-[#9dff1f] border-y border-r border-[#1c231d] font-mono text-xs mb-6">
                      <span className="text-[#9dff1f] font-bold block mb-1.5">&gt; RECOVERED CIPHERTEXT (STAGE 2 PAYLOAD):</span>
                      <div className="p-3 bg-[#111610] border border-[#1c231d] flex items-center justify-between gap-2">
                        <code className="text-[#9dff1f] font-mono text-sm sm:text-base font-bold tracking-wider select-all">
                          Rlyuls0E&#123;jhlzhy_pz_jshzzpj&#125;
                        </code>
                      </div>
                      <p className="text-gray-400 text-[11px] mt-2">
                        No new file is required for this stage. Decode this recovered ciphertext using the numbers from the Stage 1 clue.
                      </p>
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
                              onClick={() => setStage3Hint1Revealed(!stage3Hint1Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage3Hint1Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 1 ]"}
                            </button>
                          </div>
                          {stage3Hint1Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The letters appear to have been shifted by the same amount. Remember that the numbers in the Stage 1 clue (K0X-17) are needed to decode the cipher."
                            </p>
                          )}
                        </div>

                        {/* Hint 2 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 02</span>
                            <button
                              type="button"
                              onClick={() => setStage3Hint2Revealed(!stage3Hint2Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage3Hint2Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 2 ]"}
                            </button>
                          </div>
                          {stage3Hint2Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The correct shift is 7 positions backward. Apply a Caesar Cipher Decode using a shift of -7."
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Solved Status & Answer Submission Form */}
                    <div className="pt-4 border-t border-[#1c231d]">
                      {isStage3Solved && (
                        <div className="mb-6 p-4 sm:p-5 bg-[#9dff1f]/10 border-2 border-[#9dff1f] font-mono text-xs text-[#9dff1f] space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-[#9dff1f]/30">
                            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#9dff1f]">
                              <CheckCircle className="w-5 h-5 shrink-0 text-[#9dff1f]" />
                              <span>STAGE 3 SOLVED — THE ENCRYPTED NOTE HAS BEEN DECODED</span>
                            </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setActiveTab("stage4"); setFlagInput(""); setSubmissionStatus(null); }}
                            className="text-[11px] bg-[#9dff1f] text-black px-2.5 py-1 font-bold hover:bg-[#b0ff42] cursor-pointer"
                          >
                            PROCEED TO STAGE 4 &rarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetStage("stage3")}
                            className="text-[11px] text-gray-400 hover:text-red-400 underline cursor-pointer ml-2"
                            title="Reset progress to re-test this stage"
                          >
                            [ RESET ]
                          </button>
                        </div>
                          </div>
                          <p className="text-white text-xs">
                            The encrypted note has been successfully decoded.
                          </p>
                          <div className="py-1.5 px-3 bg-[#0a0f0a] border border-[#9dff1f]/40 text-white font-mono inline-block">
                            Flag recovered: <span className="text-[#9dff1f] font-bold">Kernel0X&#123;caesar_is_classic&#125;</span>
                          </div>
                          <p className="text-gray-300 text-xs">
                            The investigation now moves from hidden files and encrypted messages to the network evidence left behind by the attacker.
                          </p>
                          <p className="text-[#9dff1f] font-bold text-xs pt-1">
                            Continue to Stage 4 — The Exfiltration Trail.
                          </p>
                        </div>
                      )}

                      {!isStage3Solved && (
                        <form onSubmit={(e) => handleFlagSubmit(e, "stage3")} className="space-y-3">
                          <label className="block font-mono text-xs text-gray-400 font-semibold">
                            SUBMIT STAGE 3 FINAL FLAG:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Flag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                placeholder="Enter decrypted flag (Kernel0X{...})..."
                                className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-[#9dff1f] pl-10 pr-3 py-2.5 font-mono text-sm outline-none transition-colors"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                            >
                              <span>SUBMIT FLAG</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Event Leaderboard & Guidelines */}
                <div className="space-y-6">
                  {renderLeaderboard()}

                  {/* Stage 3 Guidelines Card */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3">// CRYPTOGRAPHY GUIDELINES:</div>
                    <ul className="text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Identify the cipher type and substitution offset.</li>
                      <li>No additional files are required for this stage.</li>
                      <li>External tools like CyberChef or Python scripts may be used.</li>
                      <li>Submit the decrypted flag using standard Kernel0X&#123;...&#125; format.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: THE EXFILTRATION TRAIL (NETWORK) */}
        {activeTab === "stage4" && (
          <div>
            {!isStage4Unlocked ? (
              /* Before Stage 3 completion: Locked state */
              <div className="bg-[#0e120e] border border-[#1c231d] p-12 text-center max-w-2xl mx-auto">
                <Lock className="w-12 h-12 text-[#9dff1f]/40 mx-auto mb-4" />
                <div className="font-mono text-xs text-gray-500 mb-2">// CHALLENGE ACCESS RESTRICTED</div>
                <h2 className="font-heading text-3xl text-white mb-2">STAGE 4 🔒 LOCKED</h2>
                <p className="font-mono text-sm text-gray-400 mb-6">
                  Complete Stage 3 to unlock this challenge.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("stage3")}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                >
                  RETURN TO STAGE 3
                </button>
              </div>
            ) : (
              /* After completing Stage 3: Full Unlocked Stage 4 view */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Challenge Mission Brief & Answer Submission */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8">
                    {/* Header Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#1c231d]">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                        <Terminal className="w-4 h-4" />
                        <span>CATEGORY: NETWORKING / NETWORK FORENSICS</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-400">
                          DIFFICULTY: <strong className="text-white">HARD</strong>
                        </span>
                        <span className="bg-[#9dff1f]/20 text-[#9dff1f] font-mono text-xs px-2.5 py-0.5 font-bold">
                          150 PTS
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl text-white mb-4 tracking-wide">
                      STAGE 4 — THE EXFILTRATION TRAIL
                    </h2>

                    {/* Storyline / Scenario Description */}
                    <div className="space-y-3 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                      <p>
                        The investigation has now moved from hidden files and encrypted messages to network evidence left behind by Kernel0X.
                      </p>
                      <p>
                        The security team recovered a packet capture from the compromised environment. The capture contains normal background traffic as well as suspicious communication that may be related to the attacker.
                      </p>
                      <p>
                        Your task is to investigate the packet capture using Wireshark and reconstruct the suspicious network activity.
                      </p>
                      <p>
                        Look carefully at the FTP communication. The control traffic may reveal an important clue, while the corresponding data transfer contains information that must be recovered for the next stage.
                      </p>
                      <p>
                        Download the packet capture and investigate the traffic.
                      </p>
                      <p className="text-[#9dff1f] font-semibold">
                        Your objective is to recover the encrypted message hidden in the network evidence.
                      </p>
                    </div>

                    {/* Download PCAP Section */}
                    <div className="p-4 bg-[#070907] border border-[#1c231d] font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#10150e] border border-[#1c231d] text-[#9dff1f]">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-white font-semibold flex items-center gap-2">
                            <span>exfil-capture.pcap</span>
                            <span className="text-[10px] text-gray-500 font-mono">(1.7 KB)</span>
                          </div>
                          <div className="text-gray-400 text-[11px]">
                            Recovered packet capture from compromised environment
                          </div>
                        </div>
                      </div>

                      <a
                        href="/challenges/stage4/exfil-capture.pcap"
                        download="exfil-capture.pcap"
                        className="inline-flex items-center gap-2 bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-5 py-2.5 transition-colors cursor-pointer shrink-0 shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PCAP</span>
                      </a>
                    </div>

                    {/* Player Task */}
                    <div className="p-4 bg-[#0a0d0a] border border-[#1c231d] font-mono text-xs mb-6">
                      <div className="text-white font-semibold mb-2.5">// PLAYER TASK:</div>
                      <ol className="text-gray-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                        <li>Download the packet capture.</li>
                        <li>Open it in Wireshark.</li>
                        <li>Identify the suspicious FTP communication.</li>
                        <li>Investigate the FTP control stream.</li>
                        <li>Look for a hostname or other useful clue.</li>
                        <li>Investigate the corresponding FTP data stream.</li>
                        <li>Recover the encrypted message transferred through the data channel.</li>
                        <li>Submit the recovered ciphertext exactly as it appears.</li>
                      </ol>
                    </div>

                    {/* Tool Badges */}
                    <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="text-gray-400">Recommended tool:</span>
                      <span className="px-2.5 py-1 bg-[#10150e] border border-[#1c231d] text-[#9dff1f]">Wireshark</span>
                      <span className="text-gray-500 ml-2">Optional command-line tool:</span>
                      <span className="px-2.5 py-1 bg-[#10150e] border border-[#1c231d] text-gray-300">TShark</span>
                    </div>

                    {/* Progressive Hints Section */}
                    <div className="border border-[#1c231d] bg-[#070907] p-4 sm:p-5 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                          <HelpCircle className="w-4 h-4" />
                          <span>INVESTIGATION HINTS (PROGRESSIVE)</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500">4 HINTS AVAILABLE</span>
                      </div>

                      <div className="space-y-2.5 font-mono text-xs">
                        {/* Hint 1 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 01</span>
                            <button
                              type="button"
                              onClick={() => setStage4Hint1Revealed(!stage4Hint1Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage4Hint1Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 1 ]"}
                            </button>
                          </div>
                          {stage4Hint1Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "Not all traffic in the capture is related to the investigation. Start by identifying the suspicious protocol."
                            </p>
                          )}
                        </div>

                        {/* Hint 2 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 02</span>
                            <button
                              type="button"
                              onClick={() => setStage4Hint2Revealed(!stage4Hint2Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage4Hint2Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 2 ]"}
                            </button>
                          </div>
                          {stage4Hint2Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "FTP separates its control communication from the data transfer. Investigate both."
                            </p>
                          )}
                        </div>

                        {/* Hint 3 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 03</span>
                            <button
                              type="button"
                              onClick={() => setStage4Hint3Revealed(!stage4Hint3Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage4Hint3Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 3 ]"}
                            </button>
                          </div>
                          {stage4Hint3Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The control conversation contains a hostname that may be important for the next stage."
                            </p>
                          )}
                        </div>

                        {/* Hint 4 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 04</span>
                            <button
                              type="button"
                              onClick={() => setStage4Hint4Revealed(!stage4Hint4Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage4Hint4Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 4 ]"}
                            </button>
                          </div>
                          {stage4Hint4Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "Follow the FTP data stream and preserve the recovered message exactly as it appears."
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Solved Status & Answer Submission Form */}
                    <div className="pt-4 border-t border-[#1c231d]">
                      {isStage4Solved && (
                        <div className="mb-6 p-4 sm:p-5 bg-[#9dff1f]/10 border-2 border-[#9dff1f] font-mono text-xs text-[#9dff1f] space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-[#9dff1f]/30">
                            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#9dff1f]">
                              <CheckCircle className="w-5 h-5 shrink-0 text-[#9dff1f]" />
                              <span>STAGE 4 SOLVED — THE EXFILTRATION TRAIL CONFIRMED</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setActiveTab("stage5"); setFlagInput(""); setSubmissionStatus(null); }}
                              className="text-[11px] bg-[#9dff1f] text-black px-2.5 py-1 font-bold hover:bg-[#b0ff42] cursor-pointer"
                            >
                              PROCEED TO STAGE 5 &rarr;
                            </button>
                          </div>
                          <p className="text-white text-xs">
                            You successfully reconstructed the suspicious FTP transfer and recovered the encrypted message from the network evidence.
                          </p>
                          <p className="text-gray-300 text-xs">
                            The FTP control traffic also revealed an important hostname clue.
                          </p>
                          <p className="text-gray-300 text-xs">
                            The recovered ciphertext has been passed to the next stage.
                          </p>
                          <p className="text-[#9dff1f] font-bold text-xs pt-1">
                            Stage 5 — The Second Cipher has been unlocked.
                          </p>
                        </div>
                      )}

                      {!isStage4Solved && (
                        <form onSubmit={(e) => handleFlagSubmit(e, "stage4")} className="space-y-3">
                          <label className="block font-mono text-xs text-gray-400 font-semibold">
                            SUBMIT STAGE 4 RAW CIPHERTEXT:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Flag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                placeholder="Enter recovered ciphertext from FTP data stream..."
                                className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-[#9dff1f] pl-10 pr-3 py-2.5 font-mono text-sm outline-none transition-colors"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                            >
                              <span>SUBMIT CIPHERTEXT</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Event Leaderboard & Guidelines */}
                <div className="space-y-6">
                  {renderLeaderboard()}

                  {/* Stage 4 Guidelines Card */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3">// NETWORK FORENSICS GUIDELINES:</div>
                    <ul className="text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Inspect the packet capture using Wireshark or TShark.</li>
                      <li>Isolate the suspicious FTP session from background network noise.</li>
                      <li>Examine the control channel for commands and hostnames.</li>
                      <li>Reconstruct the FTP data stream to extract the encrypted payload.</li>
                      <li>Submit the recovered ciphertext string exactly as captured.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 5: THE SECOND CIPHER (CRYPTOGRAPHY) */}
        {activeTab === "stage5" && (
          <div>
            {!isStage5Unlocked ? (
              /* Before Stage 4 completion: Locked state */
              <div className="bg-[#0e120e] border border-[#1c231d] p-12 text-center max-w-2xl mx-auto">
                <Lock className="w-12 h-12 text-[#9dff1f]/40 mx-auto mb-4" />
                <div className="font-mono text-xs text-gray-500 mb-2">// CHALLENGE ACCESS RESTRICTED</div>
                <h2 className="font-heading text-3xl text-white mb-2">STAGE 5 🔒 LOCKED</h2>
                <p className="font-mono text-sm text-gray-400 mb-6">
                  Complete Stage 4 (The Exfiltration Trail) to unlock this challenge.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("stage4")}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                >
                  RETURN TO STAGE 4
                </button>
              </div>
            ) : (
              /* Unlocked Stage 5 View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Challenge Mission Brief & Decryption Submission */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8">
                    {/* Header Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#1c231d]">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                        <Terminal className="w-4 h-4" />
                        <span>CATEGORY: CRYPTOGRAPHY</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-400">
                          DIFFICULTY: <strong className="text-white">HARD</strong>
                        </span>
                        <span className="bg-[#9dff1f]/20 text-[#9dff1f] font-mono text-xs px-2.5 py-0.5 font-bold">
                          150 PTS
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl text-white mb-4 tracking-wide">
                      STAGE 5 — THE SECOND CIPHER
                    </h2>

                    {/* Storyline / Scenario Description */}
                    <div className="space-y-3 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                      <p>
                        The network evidence has revealed another message left by Kernel0X.
                      </p>
                      <p>
                        The message recovered from the FTP data channel is encrypted and cannot be read directly. However, the FTP control conversation from the previous stage revealed an important hostname.
                      </p>
                      <p>
                        Use the information recovered from Stage 4 to determine the key and decrypt the ciphertext.
                      </p>
                      <p>
                        The decrypted message contains the flag for this stage and information required to continue to the final investigation environment.
                      </p>
                      <p className="text-amber-400/90 font-semibold">
                        You already have the ciphertext from Stage 4. No new file is required.
                      </p>
                    </div>

                    {/* Vigenère Cipher Key Puzzle */}
                    <div className="border border-[#1c231d] bg-[#070907] p-4 sm:p-5 mb-6 font-mono text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1c231d]">
                        <div className="flex items-center gap-2 text-[#9dff1f] font-bold text-xs sm:text-sm">
                          <Key className="w-4 h-4 text-[#9dff1f]" />
                          <span>// CRACK THE CODE — FIND THE VIGENÈRE KEY (9 LETTERS)</span>
                        </div>
                        <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                          Key Deduction Puzzle
                        </span>
                      </div>

                      <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                        To uncover the Vigenère cipher key, Kernel0X left this 9-letter deduction puzzle. Compare the guessed words with their position clues to deduce the secret key:
                      </p>

                      {/* Puzzle Image Container */}
                      <div className="bg-[#080d08] border border-[#1c231d] p-3 sm:p-4 mb-4 flex flex-col items-center">
                        <div className="relative max-w-xl w-full overflow-hidden border border-[#232f22] shadow-[0_0_35px_rgba(0,0,0,0.85)] rounded bg-[#070a07]">
                          <img
                            src="/challenges/stage5/vigenere-puzzle.png"
                            alt="Crack The Code — 9 Letters Puzzle"
                            className="w-full h-auto object-contain block hover:brightness-105 transition-all cursor-pointer"
                            onClick={() => window.open("/challenges/stage5/vigenere-puzzle.png", "_blank")}
                            title="Click to view full image in a new tab"
                          />
                        </div>
                      </div>

                      {/* Interactive Key Verification Box */}
                      <div className="p-3.5 bg-[#0d120d] border border-[#1c231d] space-y-2">
                        <label className="block text-[11px] text-gray-300 font-semibold tracking-wide">
                          TEST YOUR 9-LETTER KEY GUESS:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            maxLength={9}
                            value={puzzleKeyGuess}
                            onChange={(e) => setPuzzleKeyGuess(e.target.value.toUpperCase())}
                            placeholder="ENTER 9-LETTER WORD..."
                            className="flex-1 bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-[#9dff1f] px-3 py-2 font-mono text-sm tracking-widest outline-none uppercase font-bold"
                          />
                          {puzzleKeyGuess && (
                            <button
                              type="button"
                              onClick={() => setPuzzleKeyGuess("")}
                              className="px-3 py-2 bg-[#141a12] border border-[#1c231d] text-gray-400 hover:text-white cursor-pointer text-xs"
                            >
                              CLEAR
                            </button>
                          )}
                        </div>

                        {puzzleKeyGuess.length > 0 && (
                          <div className="pt-1">
                            {puzzleKeyGuess === "WAREHOUSE" ? (
                              <div className="p-2.5 bg-[#10190e] border border-[#9dff1f] text-[#9dff1f] text-xs flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <CheckCircle className="w-4 h-4 shrink-0 text-[#9dff1f]" />
                                  <span>KEY CRACKED: "WAREHOUSE" (9 letters) — Use this key to decrypt the Vigenère ciphertext below!</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText("WAREHOUSE")
                                    setCopiedKey(true)
                                    setTimeout(() => setCopiedKey(false), 2000)
                                  }}
                                  className="text-[10px] bg-[#9dff1f] text-black px-2.5 py-1 font-bold hover:bg-[#b0ff42] cursor-pointer shrink-0"
                                >
                                  {copiedKey ? "[ COPIED! ]" : "[ COPY KEY ]"}
                                </button>
                              </div>
                            ) : puzzleKeyGuess.length === 9 ? (
                              <div className="p-2 bg-[#190e0e] border border-red-500/50 text-red-400 text-xs flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>Incorrect key. Study the letter placements in the puzzle and compare with the Stage 4 hostname.</span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-gray-500 font-mono">
                                {9 - puzzleKeyGuess.length} letter{9 - puzzleKeyGuess.length > 1 ? "s" : ""} remaining ({puzzleKeyGuess.length}/9)...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recovered Ciphertext Banner (Passed directly from Stage 4) */}
                    <div className="p-4 bg-[#070907] border-l-2 border-[#9dff1f] border-y border-r border-[#1c231d] font-mono text-xs mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#9dff1f] font-bold">&gt; RECOVERED MESSAGE</span>
                        {stage4Ciphertext && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(stage4Ciphertext)
                              setCopiedCiphertext(true)
                              setTimeout(() => setCopiedCiphertext(false), 2000)
                            }}
                            className="text-[#9dff1f] hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedCiphertext ? "[ COPIED! ]" : "[ COPY CIPHERTEXT ]"}</span>
                          </button>
                        )}
                      </div>
                      <div className="p-3 bg-[#111610] border border-[#1c231d] overflow-x-auto">
                        <code className="text-[#9dff1f] font-mono text-xs sm:text-sm font-bold tracking-wider select-all break-all">
                          {stage4Ciphertext || "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=mlece6|JXHUY6_HVKTFGVZ=MKL|OTRKL6_IMWVJADI=r0l_ihinaksy|GNSKA6_PRWZKIJH=Jeoe@2026!"}
                        </code>
                      </div>
                      <p className="text-gray-400 text-[11px] mt-2">
                        Source: Stage 4 — The Exfiltration Trail
                      </p>
                    </div>

                    {/* Player Task */}
                    <div className="p-4 bg-[#0a0d0a] border border-[#1c231d] font-mono text-xs mb-6">
                      <div className="text-white font-semibold mb-2.5">// PLAYER TASK:</div>
                      <ol className="text-gray-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                        <li>Review the hostname discovered during the Stage 4 investigation.</li>
                        <li>Determine the appropriate Vigenère key from the hostname.</li>
                        <li>Use the ciphertext recovered in Stage 4.</li>
                        <li>Decrypt the message using the derived key.</li>
                        <li>Recover the Stage 5 flag.</li>
                        <li>Record the credentials revealed in the decrypted message for the final investigation stage.</li>
                      </ol>
                    </div>

                    {/* Tool Badges */}
                    <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="text-gray-400">Recommended Tools:</span>
                      <span className="px-2.5 py-1 bg-[#10150e] border border-[#1c231d] text-[#9dff1f]">CyberChef (Vigenère Decode)</span>
                      <span className="px-2.5 py-1 bg-[#10150e] border border-[#1c231d] text-gray-300">Python</span>
                    </div>

                    {/* Progressive Hints Section */}
                    <div className="border border-[#1c231d] bg-[#070907] p-4 sm:p-5 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                          <HelpCircle className="w-4 h-4" />
                          <span>INVESTIGATION HINTS (PROGRESSIVE)</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500">3 HINTS AVAILABLE</span>
                      </div>

                      <div className="space-y-2.5 font-mono text-xs">
                        {/* Hint 1 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 01</span>
                            <button
                              type="button"
                              onClick={() => setStage5Hint1Revealed(!stage5Hint1Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage5Hint1Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 1 ]"}
                            </button>
                          </div>
                          {stage5Hint1Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The ciphertext is not a random encoding. It uses a classical Vigenère cipher."
                            </p>
                          )}
                        </div>

                        {/* Hint 2 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 02</span>
                            <button
                              type="button"
                              onClick={() => setStage5Hint2Revealed(!stage5Hint2Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage5Hint2Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 2 ]"}
                            </button>
                          </div>
                          {stage5Hint2Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "The FTP server hostname from Stage 4 is more important than it first appeared."
                            </p>
                          )}
                        </div>

                        {/* Hint 3 */}
                        <div className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT 03</span>
                            <button
                              type="button"
                              onClick={() => setStage5Hint3Revealed(!stage5Hint3Revealed)}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {stage5Hint3Revealed ? "[ HIDE HINT ]" : "[ REVEAL HINT 3 ]"}
                            </button>
                          </div>
                          {stage5Hint3Revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "Look at the meaningful identifier in the hostname and consider how it could be used as a Vigenère key."
                            </p>
                          )}
                        </div>
                      </div>
                    </div>



                    {/* Solved Status & Answer Submission Form */}
                    <div className="pt-4 border-t border-[#1c231d]">
                      {isStage5Solved && (
                        <div className="mb-6 p-4 sm:p-5 bg-[#9dff1f]/10 border-2 border-[#9dff1f] font-mono text-xs text-[#9dff1f] space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-[#9dff1f]/30">
                            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#9dff1f]">
                              <CheckCircle className="w-5 h-5 shrink-0 text-[#9dff1f]" />
                              <span>STAGE 5 SOLVED — THE SECOND CIPHER DECODED</span>
                            </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setActiveTab("stage6"); setFlagInput(""); setSubmissionStatus(null); }}
                            className="text-[11px] bg-[#9dff1f] text-black px-2.5 py-1 font-bold hover:bg-[#b0ff42] cursor-pointer"
                          >
                            PROCEED TO STAGE 6 &rarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetStage("stage5")}
                            className="text-[11px] text-gray-400 hover:text-red-400 underline cursor-pointer ml-2"
                            title="Reset progress to re-test this stage"
                          >
                            [ RESET ]
                          </button>
                        </div>
                          </div>
                          <p className="text-white text-xs">
                            The encrypted message has been successfully decrypted.
                          </p>
                          <div className="py-1.5 px-3 bg-[#0a0f0a] border border-[#9dff1f]/40 text-white font-mono inline-block">
                            Flag confirmed: <span className="text-[#9dff1f] font-bold">Kernel0X&#123;warehouse9_vigenere&#125;</span>
                          </div>
                          <p className="text-gray-300 text-xs">
                            The investigation has revealed the next stage of the attacker's operation.
                          </p>
                          <p className="text-gray-300 text-xs">
                            The credentials required to access the live investigation environment have also been recovered.
                          </p>
                          <p className="text-[#9dff1f] font-bold text-xs pt-1">
                            Stage 6 — Kernel0X's Final Message has been unlocked.
                          </p>
                        </div>
                      )}

                      {!isStage5Solved && (
                        <form onSubmit={(e) => handleFlagSubmit(e, "stage5")} className="space-y-3">
                          <label className="block font-mono text-xs text-gray-400 font-semibold">
                            SUBMIT STAGE 5 FINAL FLAG:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Flag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                placeholder="Enter decrypted flag (Kernel0X{...})..."
                                className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-[#9dff1f] pl-10 pr-3 py-2.5 font-mono text-sm outline-none transition-colors"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                            >
                              <span>SUBMIT FLAG</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Event Leaderboard & Guidelines */}
                <div className="space-y-6">
                  {renderLeaderboard()}

                  {/* Stage 5 Guidelines Card */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3">// VIGENÈRE CIPHER GUIDELINES:</div>
                    <ul className="text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Review the hostname discovered during the Stage 4 investigation.</li>
                      <li>Determine the appropriate Vigenère key from the hostname.</li>
                      <li>Standard Vigenère preserves punctuation, spaces, and numbers.</li>
                      <li>Extract the Stage 5 flag and record the terminal credentials for Stage 6.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 6: KERNEL0X'S FINAL MESSAGE (LIVE CONTAINER) */}
        {activeTab === "stage6" && (
          <div>
            {!isStage6Unlocked ? (
              /* Before Stage 5 completion: Locked state */
              <div className="bg-[#0e120e] border border-[#1c231d] p-12 text-center max-w-2xl mx-auto">
                <Lock className="w-12 h-12 text-[#9dff1f]/40 mx-auto mb-4" />
                <div className="font-mono text-xs text-gray-500 mb-2">// CHALLENGE ACCESS RESTRICTED</div>
                <h2 className="font-heading text-3xl text-white mb-2">STAGE 6 🔒 LOCKED</h2>
                <p className="font-mono text-sm text-gray-400 mb-6">
                  Complete Stage 5 (The Second Cipher) to unlock this challenge.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("stage5")}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                >
                  RETURN TO STAGE 5
                </button>
              </div>
            ) : (
              /* Unlocked Stage 6 — Kernel0X's Final Message (CAPSTONE) */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Mission Brief, Credentials, Objective, Hints, Submission */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Main Challenge Card */}
                  <div className="bg-[#0e120e] border border-[#9dff1f]/40 p-6 sm:p-8 relative overflow-hidden">
                    {/* Capstone glowing corner accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9dff1f]/4 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9dff1f] to-transparent" />

                    {/* Header Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-[#1c231d] relative z-10">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                        <Terminal className="w-4 h-4" />
                        <span>CATEGORY: CRYPTOGRAPHY / STEGANOGRAPHY / LIVE SYSTEM</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-400">
                          DIFFICULTY: <strong className="text-amber-400">EXTREME</strong>
                        </span>
                        <span className="bg-amber-400/20 text-amber-400 border border-amber-400/40 font-mono text-xs px-2.5 py-0.5 font-bold">
                          200 PTS
                        </span>
                        <span className="bg-[#9dff1f]/15 text-[#9dff1f] border border-[#9dff1f]/40 font-mono text-[10px] px-2 py-0.5 font-bold tracking-wider">
                          ★ FINAL STAGE
                        </span>
                      </div>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-4xl text-white mb-2 tracking-wide relative z-10">
                      STAGE 6 — KERNEL0X'S FINAL MESSAGE
                    </h2>
                    <p className="font-mono text-[11px] text-[#9dff1f] mb-6 relative z-10 tracking-wider">
                      &gt; THE FINAL DEAD-DROP — MULTI-LAYER CRYPTOGRAPHIC INVESTIGATION
                    </p>

                    {/* Scenario / Narrative */}
                    <div className="space-y-3 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 relative z-10">
                      <p>
                        The network investigation has revealed that Kernel0X maintained a live dead-drop system used during the breach.
                      </p>
                      <p>
                        The access information has been reconstructed from the evidence collected during the previous stages.
                      </p>
                      <p>
                        You now have a target IP address and port.
                      </p>
                      <p>
                        Your task is to connect to the restricted server and recover Kernel0X's final message.
                      </p>
                      <p className="text-gray-400 italic text-xs">
                        The machine contains only the service required for this investigation. No network enumeration is necessary.
                      </p>
                      <p className="text-[#9dff1f] font-semibold text-xs">
                        The final message is protected by more than one layer. Recover the hidden data, understand the first encrypted message, and use what you discover to solve the second layer.
                      </p>
                    </div>
                  </div>

                  {/* TARGET & CREDENTIALS BLOCK */}
                  <div className="bg-[#070907] border-l-4 border-[#9dff1f] border-y border-r border-[#1c231d] p-5 font-mono text-xs">
                    <div className="flex items-center gap-2 text-[#9dff1f] font-bold mb-4">
                      <Terminal className="w-4 h-4" />
                      <span>&gt; RECOVERED ACCESS CREDENTIALS — FROM PREVIOUS STAGE INVESTIGATION:</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#0d130d] border border-[#1c231d] p-3">
                        <span className="text-gray-500 block text-[10px] mb-1">TARGET</span>
                        <span className="text-white font-bold text-sm">47.129.24.175</span>
                      </div>
                      <div className="bg-[#0d130d] border border-[#1c231d] p-3">
                        <span className="text-gray-500 block text-[10px] mb-1">PORT</span>
                        <span className="text-white font-bold text-sm">2222</span>
                      </div>
                      <div className="bg-[#0d130d] border border-[#1c231d] p-3 col-span-2 sm:col-span-1">
                        <span className="text-gray-500 block text-[10px] mb-1">PROTOCOL</span>
                        <span className="text-amber-400 font-bold text-sm">SSH</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0d130d] border border-[#1c231d] p-3">
                        <span className="text-gray-500 block text-[10px] mb-1">USERNAME</span>
                        <span className="text-[#9dff1f] font-bold text-sm">Recovered in Stage 1</span>
                        <span className="text-gray-400 text-[10px] block mt-1">— Clue / access code discovered during Stage 1 investigation</span>
                      </div>
                      <div className="bg-[#0d130d] border border-amber-400/30 p-3">
                        <span className="text-gray-500 block text-[10px] mb-1">PASSWORD</span>
                        <span className="text-amber-400 font-bold text-sm">Recovered in Stage 5</span>
                        <span className="text-gray-400 text-[10px] block mt-1">— Your Stage 5 recovered flag, reused as the SSH password</span>
                      </div>
                    </div>

                    {/* SSH Copy Command */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex-1 bg-[#0a0e0a] border border-[#1c231d] px-4 py-2.5 font-mono text-xs text-[#9dff1f] break-all select-all">
                          ssh -p 2222 &lt;username&gt;@47.129.24.175
                        </div>
                        <button
                          type="button"
                          id="stage6-copy-ssh"
                          onClick={() => {
                            navigator.clipboard.writeText("ssh -p 2222 <username>@47.129.24.175").then(() => {
                              setCopiedSshCmd(true)
                              setTimeout(() => setCopiedSshCmd(false), 2500)
                            })
                          }}
                          className="flex items-center gap-2 bg-[#141c12] hover:bg-[#1e2e1a] border border-[#9dff1f]/40 hover:border-[#9dff1f] text-[#9dff1f] font-mono font-bold text-xs px-4 py-2.5 transition-all cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedSshCmd ? "COPIED!" : "COPY COMMAND"}
                        </button>
                      </div>
                      <p className="text-gray-500 text-[10px] font-mono">
                        * Replace &lt;username&gt; with the access code from Stage 1. When prompted for password, enter your Stage 5 flag.
                      </p>
                    </div>
                  </div>

                  {/* INVESTIGATION OBJECTIVE */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-5 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3 flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>&gt; INVESTIGATION OBJECTIVE:</span>
                    </div>
                    <ol className="space-y-2.5 text-gray-300 list-none">
                      {[
                        { n: "01", t: "Connect to the target server using the credentials above via SSH." },
                        { n: "02", t: "Investigate the filesystem. Locate the hidden dead-drop image at: /opt/stage6/dead-drop.png" },
                        { n: "03", t: "Analyse the image for concealed data. The technique differs from Stage 2 — examine the bit planes and colour channels." },
                        { n: "04", t: "Decrypt the first layer of the recovered ciphertext using a repeating keyword-based substitution cipher." },
                        { n: "05", t: "Read the first decrypted message carefully — it reveals the key required for the second layer." },
                        { n: "06", t: "Locate the hidden dotfile and use the recovered key to decrypt the hexadecimal ciphertext it contains." },
                        { n: "07", t: "Submit the final flag using the form below." },
                      ].map(step => (
                        <li key={step.n} className="flex items-start gap-3">
                          <span className="text-[#9dff1f] font-bold shrink-0 text-[11px] mt-0.5">{step.n}.</span>
                          <span className="text-gray-300 leading-relaxed">{step.t}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* PROGRESSIVE HINTS */}
                  <div className="border border-[#1c231d] bg-[#070907] p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
                        <HelpCircle className="w-4 h-4" />
                        <span>INVESTIGATION HINTS (PROGRESSIVE)</span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-500">6 HINTS AVAILABLE</span>
                    </div>

                    <div className="space-y-2.5 font-mono text-xs">
                      {[
                        { n: "01", revealed: stage6Hint1Revealed, toggle: () => setStage6Hint1Revealed(v => !v), text: "You already recovered two pieces of information during the investigation. One identifies the account; the other authenticates it." },
                        { n: "02", revealed: stage6Hint2Revealed, toggle: () => setStage6Hint2Revealed(v => !v), text: "This image does not rely on the same hiding technique used earlier. Examine its individual bit planes and colour channels." },
                        { n: "03", revealed: stage6Hint3Revealed, toggle: () => setStage6Hint3Revealed(v => !v), text: "The recovered text is structured ciphertext. A repeating keyword-based substitution cipher may be useful." },
                        { n: "04", revealed: stage6Hint4Revealed, toggle: () => setStage6Hint4Revealed(v => !v), text: "The first decrypted message is not the flag. Read it carefully — it tells you what you need for the next layer." },
                        { n: "05", revealed: stage6Hint5Revealed, toggle: () => setStage6Hint5Revealed(v => !v), text: "Not every file is visible with a normal directory listing." },
                        { n: "06", revealed: stage6Hint6Revealed, toggle: () => setStage6Hint6Revealed(v => !v), text: "The second ciphertext is hexadecimal data. The key you recovered from the first layer is required to process it." },
                      ].map(hint => (
                        <div key={hint.n} className="border border-[#1c231d] bg-[#0c100c] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">// HINT {hint.n}</span>
                            <button
                              type="button"
                              onClick={hint.toggle}
                              className="text-[#9dff1f] hover:underline text-[11px] cursor-pointer"
                            >
                              {hint.revealed ? "[ HIDE HINT ]" : `[ REVEAL HINT ${hint.n} ]`}
                            </button>
                          </div>
                          {hint.revealed && (
                            <p className="mt-2 text-white pt-2 border-t border-[#1c231d] text-xs leading-relaxed">
                              "{hint.text}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FLAG SUBMISSION */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 sm:p-8">
                    <div className="pt-0 border-t-0">
                      {isStage6Solved ? (
                        /* Stage 6 Solved — Investigation Complete */
                        <div className="p-5 sm:p-7 bg-[#9dff1f]/10 border-2 border-[#9dff1f] font-mono text-xs text-[#9dff1f] space-y-3 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#9dff1f]/3 pointer-events-none" />
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#9dff1f] shadow-[0_0_12px_#9dff1f]" />
                          <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#9dff1f]/30 mb-3">
                              <div className="flex items-center gap-2 font-bold text-base tracking-wide text-[#9dff1f]">
                                <CheckCircle className="w-6 h-6 shrink-0 text-[#9dff1f]" />
                                <span>KERNEL0X — INVESTIGATION COMPLETE</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigate("/thank-you")}
                                className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-4 py-2 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(157,255,31,0.3)] shrink-0"
                              >
                                <Sparkles className="w-4 h-4 text-black" />
                                <span>VIEW THANK YOU &amp; CERTIFICATE &rarr;</span>
                              </button>
                            </div>
                            <p className="text-white text-xs mb-2">
                              You successfully reconstructed the final stage of the breach.
                            </p>
                            <p className="text-gray-300 text-xs mb-2">
                              You recovered the Stage 6 dead-drop image, identified the hidden data, decoded the first cryptographic layer, and used the recovered key to decrypt the second layer.
                            </p>
                            <div className="mt-3 pt-3 border-t border-[#9dff1f]/20 flex flex-wrap items-center gap-3">
                              <div className="py-2 px-3 bg-[#0a0f0a] border border-[#9dff1f]/50 inline-block">
                                <span className="text-gray-400 text-[11px]">Final Flag: </span>
                                <span className="text-[#9dff1f] font-bold">Kernel0X&#123;dead_drop_recovered&#125;</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigate("/thank-you")}
                                className="bg-[#141e12] hover:bg-[#1f301b] border border-[#9dff1f]/60 text-[#9dff1f] font-mono font-bold text-xs px-4 py-2 transition-all cursor-pointer flex items-center gap-2"
                              >
                                <Award className="w-4 h-4 text-[#9dff1f]" />
                                <span>CLAIM OFFICIAL PARTICIPATION CERTIFICATE</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Flag Submission Form */
                        <form onSubmit={(e) => handleFlagSubmit(e, "stage6")} className="space-y-3">
                          <label className="block font-mono text-xs text-gray-400 font-semibold">
                            SUBMIT STAGE 6 FINAL FLAG:
                          </label>
                          <p className="font-mono text-[11px] text-gray-500">
                            Enter the flag recovered from the final decryption layer in the format: Kernel0X&#123;...&#125;
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Flag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                              <input
                                id="stage6-flag-input"
                                type="text"
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                placeholder="Enter final flag (Kernel0X{...})..."
                                className="w-full bg-[#070907] border border-[#1c231d] focus:border-[#9dff1f] text-[#9dff1f] pl-10 pr-3 py-2.5 font-mono text-sm outline-none transition-colors"
                              />
                            </div>
                            <button
                              id="stage6-flag-submit"
                              type="submit"
                              className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-6 py-2.5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.2)]"
                            >
                              <span>SUBMIT FLAG</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column: Live Leaderboard & Stage 6 Guidelines */}
                <div className="space-y-6">
                  {renderLeaderboard()}

                  {/* Stage 6 Guidelines */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3">// STAGE 6 GUIDELINES:</div>
                    <ul className="text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                      <li>Connect via SSH using the recovered credentials.</li>
                      <li>Investigate the filesystem thoroughly — not every file is immediately visible.</li>
                      <li>The dead-drop image uses a different steganographic technique to Stage 2.</li>
                      <li>The first ciphertext requires a keyword-based cipher for decryption.</li>
                      <li>The first decryption reveals the key required for the second layer.</li>
                      <li>The second ciphertext is in hexadecimal format and uses XOR with a repeating key.</li>
                      <li>Decoding both layers correctly reveals the final flag.</li>
                    </ul>
                  </div>

                  {/* Tools Recommended */}
                  <div className="bg-[#0e120e] border border-[#1c231d] p-6 font-mono text-xs">
                    <div className="text-[#9dff1f] font-bold mb-3">// RECOMMENDED TOOLS:</div>
                    <div className="flex flex-wrap gap-2">
                      {["SSH client", "zsteg", "CyberChef", "Python 3", "xxd / hexdump"].map(t => (
                        <span key={t} className="px-2.5 py-1 bg-[#101610] border border-[#1c231d] text-[#9dff1f] text-[11px]">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CATCH-ALL FOR ANY OTHER TAB: PRESERVED AS LOCKED */}
        {activeTab !== "stage1" && activeTab !== "stage2" && activeTab !== "stage3" && activeTab !== "stage4" && activeTab !== "stage5" && activeTab !== "stage6" && (
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

        {/* CAPSTONE SOLVED CELEBRATION MODAL */}
        {showCelebrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-[#0a0f0a] border-2 border-[#9dff1f] shadow-[0_0_50px_rgba(157,255,31,0.25)] p-6 sm:p-8 font-mono text-center overflow-hidden">
              {/* Ambient Corner Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9dff1f]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9dff1f] to-transparent" />

              <button
                type="button"
                onClick={() => setShowCelebrationModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#141f12] border-2 border-[#9dff1f] flex items-center justify-center text-[#9dff1f] shadow-[0_0_20px_rgba(157,255,31,0.4)] animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="text-xs text-[#9dff1f] tracking-widest uppercase mb-1">
                ★ OPERATION COMPLETED // ALL 6 STAGES SOLVED ★
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl text-white mb-3 tracking-wide">
                CONGRATULATIONS, OPERATIVE!
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                You cracked the final dead-drop layer and successfully brought the Kernel0X breach investigation to a close! Thank you for participating in our CTF Play Box.
              </p>

              <div className="bg-[#101610] border border-[#1c231d] p-3 mb-6 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">TOTAL XP EARNED</span>
                  <span className="text-amber-400 font-bold text-sm">{points} XP</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">STATUS</span>
                  <span className="text-[#9dff1f] font-bold text-sm">BREACH RESOLVED</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowCelebrationModal(false)
                    navigate("/thank-you")
                  }}
                  className="w-full bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-bold text-xs py-3 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.3)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>VIEW OFFICIAL DEBRIEF &amp; THANK YOU PAGE &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCelebrationModal(false)}
                  className="w-full bg-[#141a12] hover:bg-[#1a2418] border border-[#1c231d] text-gray-400 hover:text-white text-xs py-2.5 transition-colors cursor-pointer"
                >
                  RETURN TO OPERATIONS CONSOLE
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
