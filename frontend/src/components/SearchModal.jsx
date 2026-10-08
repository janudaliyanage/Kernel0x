import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Search,
  X,
  Terminal,
  HelpCircle,
  Compass,
  ShieldCheck,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Copy,
  Check,
  LogOut,
  LogIn,
  UserPlus,
  Flame,
  FileText,
  CornerDownLeft,
} from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import { useAuth } from "@/context/AuthContext"

// Complete telemetry searchable database
const SEARCH_DATABASE = [
  // --- NAVIGATION ---
  {
    id: "nav-home",
    category: "NAVIGATION",
    type: "nav",
    title: "Home // Command Feed",
    subtitle: "Hero mission overview, terminal status, live 3D spline scene",
    target: "/#home",
    keywords: ["home", "main", "start", "landing", "kernel0x", "top", "feed"],
    badge: "ROUTE",
  },
  {
    id: "nav-about",
    category: "NAVIGATION",
    type: "nav",
    title: "About CTF // Operational Briefing",
    subtitle: "Kernel0X event breakdown, mission briefing, specimen jar",
    target: "/#about-ctf",
    keywords: ["about", "ctf", "briefing", "specimen", "mission", "reconnaissance", "sliit", "rules"],
    badge: "ROUTE",
  },
  {
    id: "nav-levels",
    category: "NAVIGATION",
    type: "nav",
    title: "Levels // Stage Matrix",
    subtitle: "4 operational problem stages: OSINT, Stego, Crypto, Network",
    target: "/#levels",
    keywords: ["levels", "stages", "matrix", "schedule", "challenges", "problem set", "roadmap"],
    badge: "ROUTE",
  },
  {
    id: "nav-faqs",
    category: "NAVIGATION",
    type: "nav",
    title: "FAQs // Operational Knowledge Base",
    subtitle: "Competition rules, eligibility, flag syntax, and tools",
    target: "/#faqs",
    keywords: ["faq", "faqs", "help", "questions", "rules", "answers", "support", "guidelines"],
    badge: "ROUTE",
  },
  {
    id: "nav-arena",
    category: "NAVIGATION",
    type: "nav",
    title: "CTF Arena // Interactive Mission Portal",
    subtitle: "Live challenges, flag submission console, dynamic hints & scoring",
    target: "/ctf-portal",
    keywords: ["arena", "portal", "submit", "flag", "score", "points", "terminal", "play", "challenges"],
    badge: "LIVE ARENA",
    isArena: true,
  },
  {
    id: "nav-contact",
    category: "NAVIGATION",
    type: "nav",
    title: "Headquarters & Inquiries // SLIIT Malabe",
    subtitle: "Kernel0X HQ, moderator contact transmission, enquiry form",
    target: "/#contact",
    keywords: ["contact", "enquiry", "headquarters", "hq", "sliit", "malabe", "email", "support"],
    badge: "CONTACT",
  },

  // --- STAGES & CHALLENGES ---
  {
    id: "stage-01",
    category: "STAGES",
    type: "stage",
    title: "Level 01: OSINT (Diff: 1 - Easiest ★★)",
    subtitle: "Low barrier to entry // Teaches real-world information-gathering skills",
    target: "/#levels",
    keywords: ["osint", "reconnaissance", "information-gathering", "penetration testing", "level 01", "stage 1", "easiest", "flag"],
    badge: "ACTIVE STAGE",
    isUnlocked: true,
    stageKey: "stage1",
  },
  {
    id: "stage-02",
    category: "STAGES",
    type: "stage",
    title: "Level 02: Steganography (Diff: 2 ★★★)",
    subtitle: "Common in beginner CTFs // steghide & zsteg file-analysis fundamentals",
    target: "/#levels",
    keywords: ["steganography", "stego", "steghide", "zsteg", "file-analysis", "level 02", "stage 2"],
    badge: "COMING SEP 15",
    isUnlocked: false,
    stageKey: "stage2",
  },
  {
    id: "stage-03",
    category: "STAGES",
    type: "stage",
    title: "Level 03: Cryptography (Diff: 3 ★★★★)",
    subtitle: "Core security theory (confidentiality, weak ciphers) // CyberChef",
    target: "/#levels",
    keywords: ["cryptography", "crypto", "cipher", "confidentiality", "weak ciphers", "cyberchef", "level 03", "stage 3"],
    badge: "COMING SEP 22",
    isUnlocked: false,
    stageKey: "stage3",
  },
  {
    id: "stage-04",
    category: "STAGES",
    type: "stage",
    title: "Level 04: Network (Diff: 4 - Hardest ★★★★★)",
    subtitle: "Practical packet-analysis with Wireshark // Incident response",
    target: "/#levels",
    keywords: ["network", "networking", "wireshark", "packet-analysis", "incident response", "level 04", "stage 4", "hardest"],
    badge: "COMING SEP 29",
    isUnlocked: false,
    stageKey: "stage4",
  },
  {
    id: "stage-classified",
    category: "STAGES",
    type: "stage",
    title: "Stage 05 / 06: Classified Finals",
    subtitle: "FINALS // Reserved for top verified operatives on the championship leaderboard",
    target: "/#levels",
    keywords: ["classified", "stage 05", "stage 06", "finals", "championship", "secret", "locked"],
    badge: "CLASSIFIED",
    isUnlocked: false,
  },

  // --- FAQS & RULES ---
  {
    id: "faq-0",
    category: "FAQS",
    type: "faq",
    title: "How do I participate in the CTF?",
    subtitle: "Enlist codename & official campus email. Verify 6-digit code to access the portal.",
    answer: "Click 'JOIN CTF' to enlist with your codename and university/official email. Complete the 6-digit email verification step to instantly activate your credentials and enter the competition portal.",
    keywords: ["participate", "how", "register", "join", "enlist", "sign up", "account", "verification"],
    badge: "FAQ [01]",
    faqIndex: 0,
  },
  {
    id: "faq-1",
    category: "FAQS",
    type: "faq",
    title: "Why is email verification required?",
    subtitle: "Prevents duplicate accounts, verifies campus eligibility, transmits hint broadcasts.",
    answer: "Email verification ensures one operative account per participant, authenticates official campus eligibility, and delivers security tokens and hint broadcasts directly to your inbox.",
    keywords: ["email", "verification", "why", "code", "otp", "token", "campus", "eligibility"],
    badge: "FAQ [02]",
    faqIndex: 1,
  },
  {
    id: "faq-2",
    category: "FAQS",
    type: "faq",
    title: "What are the four competition stages?",
    subtitle: "OSINT (Stage 1), Steganography (Stage 2), Cryptography (Stage 3), Network (Stage 4).",
    answer: "OSINT (Stage 1), Steganography (Stage 2), Cryptography (Stage 3), and Network Exploitation (Stage 4). Each stage unlocks sequentially and features real-world scenario challenges.",
    keywords: ["stages", "four", "categories", "osint", "steganography", "cryptography", "network", "challenge types"],
    badge: "FAQ [03]",
    faqIndex: 2,
  },
  {
    id: "faq-3",
    category: "FAQS",
    type: "faq",
    title: "Will there be clues or hints for the challenges?",
    subtitle: "Each challenge includes tactical briefings and progressive contextual hints.",
    answer: "Each challenge includes a tactical briefing and contextual hints. Solvers must formulate their own exploitation strategies to capture the flag.",
    keywords: ["clues", "hints", "progressive", "help", "stuck", "briefing", "solution"],
    badge: "FAQ [04]",
    faqIndex: 3,
  },
  {
    id: "faq-4",
    category: "FAQS",
    type: "faq",
    title: "What tools and software do I need to solve challenges?",
    subtitle: "Browser, Linux terminal, Wireshark, CyberChef, Steghide, Exiftool (Free & Open Source).",
    answer: "A standard browser, a Linux or Unix terminal, and standard network/crypto analysis utilities (e.g. Wireshark, CyberChef, Steghide, Exiftool). No proprietary paid tools required.",
    keywords: ["tools", "software", "wireshark", "cyberchef", "steghide", "exiftool", "terminal", "linux", "kali", "utilities"],
    badge: "FAQ [05]",
    faqIndex: 4,
  },
  {
    id: "faq-5",
    category: "FAQS",
    type: "faq",
    title: "Technical assistance & contact",
    subtitle: "Reach out to moderators or submit enquiry via the dispatch briefing form.",
    answer: "Reach out to the moderators listed in the footer, or submit a query using the briefing form on this welcome page.",
    keywords: ["help", "support", "technical", "assistance", "moderator", "contact", "bug", "query"],
    badge: "FAQ [06]",
    faqIndex: 5,
  },
  {
    id: "faq-6",
    category: "FAQS",
    type: "faq",
    title: "Flag format and submission procedure",
    subtitle: "All flags format: Kernel0X{string_here}. Enter directly in the CTF Arena portal.",
    answer: "All flags follow the format Kernel0X{string_here}. Once you uncover a flag, enter it directly into the flag submission box on the active CTF portal page.",
    keywords: ["flag", "format", "syntax", "kernel0x{", "submit", "submission", "points", "how to submit"],
    badge: "FLAG SPEC",
    faqIndex: 6,
    hasCopyableFlag: true,
  },
  {
    id: "faq-7",
    category: "FAQS",
    type: "faq",
    title: "Winning criteria & scoring tiebreakers",
    subtitle: "Ranked by points accrued across stages. Ties resolved by timestamp.",
    answer: "Operatives are ranked by total points accrued across all solved stages. Ties are resolved by the earliest verified flag submission timestamp.",
    keywords: ["winning", "criteria", "points", "score", "tie", "tiebreaker", "leaderboard", "rank", "prizes"],
    badge: "FAQ [08]",
    faqIndex: 7,
  },

  // --- ACTIONS ---
  {
    id: "action-arena",
    category: "ACTIONS",
    type: "action",
    title: "Enter CTF Arena Console",
    subtitle: "Access active challenge terminal, download investigator brief, submit flags",
    keywords: ["arena", "enter", "portal", "launch", "ctf", "play", "terminal"],
    badge: "COMMAND",
    actionType: "arena",
  },
  {
    id: "action-login",
    category: "ACTIONS",
    type: "action",
    title: "Sign In Operative Session",
    subtitle: "Authenticate with codename / email and secure passphrase",
    keywords: ["login", "sign in", "auth", "session", "access"],
    badge: "AUTH",
    actionType: "login",
  },
  {
    id: "action-register",
    category: "ACTIONS",
    type: "action",
    title: "Enlist New Operative / Join CTF",
    subtitle: "Create operative handle, campus email, and optional squadron team",
    keywords: ["register", "join ctf", "enlist", "sign up", "create account", "team"],
    badge: "JOIN",
    actionType: "register",
  },
]

const CATEGORIES = ["ALL", "STAGES", "FAQS", "NAVIGATION", "ACTIONS"]

export default function SearchModal() {
  const { isOpen, closeSearch } = useSearch()
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedFlag, setCopiedFlag] = useState(false)
  const [expandedFaqId, setExpandedFaqId] = useState(null)

  const inputRef = useRef(null)
  const resultsContainerRef = useRef(null)

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedCategory("ALL")
      setSelectedIndex(0)
      setExpandedFaqId(null)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  // Filter items based on query only (no category tabs)
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    return SEARCH_DATABASE.filter((item) => {
      // Check title match
      if (item.title.toLowerCase().includes(q)) return true

      // Check subtitle / answer match
      if (item.subtitle.toLowerCase().includes(q)) return true
      if (item.answer && item.answer.toLowerCase().includes(q)) return true

      // Check keywords match
      if (item.keywords.some((k) => k.toLowerCase().includes(q))) return true

      return false
    })
  }, [query])

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredResults.length])

  // Scroll active item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return
    const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [selectedIndex])

  // Handle execution of an item
  const handleSelect = (item) => {
    closeSearch()

    if (item.type === "action") {
      if (item.actionType === "arena") {
        if (isAuthenticated) {
          navigate("/ctf-portal")
        } else {
          openAuthModal("login")
        }
      } else if (item.actionType === "login") {
        openAuthModal("login")
      } else if (item.actionType === "register") {
        openAuthModal("register")
      } else if (item.actionType === "logout") {
        logout()
      }
      return
    }

    if (item.type === "nav") {
      if (item.target.startsWith("/#")) {
        const hash = item.target.replace("/", "")
        if (location.pathname === "/") {
          const id = hash.replace("#", "")
          const targetEl = document.getElementById(id)
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" })
            window.history.pushState(null, "", hash)
          }
        } else {
          navigate(item.target)
        }
      } else {
        navigate(item.target)
      }
      return
    }

    if (item.type === "stage") {
      if (item.stageKey === "stage1" && isAuthenticated) {
        navigate("/ctf-portal")
      } else {
        if (location.pathname === "/") {
          const el = document.getElementById("levels")
          if (el) el.scrollIntoView({ behavior: "smooth" })
        } else {
          navigate("/#levels")
        }
      }
      return
    }

    if (item.type === "faq") {
      const openFaqAction = () => {
        window.dispatchEvent(
          new CustomEvent("kernel0x:open-faq", {
            detail: item.faqIndex,
          })
        )
      }

      if (location.pathname === "/") {
        const el = document.getElementById("faqs")
        if (el) el.scrollIntoView({ behavior: "smooth" })
        openFaqAction()
      } else {
        navigate("/#faqs")
        setTimeout(openFaqAction, 300)
      }
    }
  }

  // Keyboard navigation within modal
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex])
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
    }
  }

  const handleCopyFlagFormat = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText("Kernel0X{FLAG_HERE}")
    setCopiedFlag(true)
    setTimeout(() => setCopiedFlag(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kernel0X Command Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-2xl bg-[#0b0f0b] border border-[#9dff1f]/40 shadow-[0_0_50px_rgba(157,255,31,0.15)] flex flex-col overflow-hidden text-white font-sans animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#101610] border-b border-[#1c231d] font-mono text-xs select-none">
          <div className="flex items-center gap-2 text-[#9dff1f]">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wider">[ KERNEL0X :: SEARCH MATRIX ]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
              INDEX: {SEARCH_DATABASE.length} TELEMETRY OBJECTS
            </span>
            <button
              onClick={closeSearch}
              className="text-gray-400 hover:text-[#9dff1f] transition-colors p-1 cursor-pointer"
              title="Close (ESC)"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1c231d] bg-[#0c110c] relative">
          <div className="flex items-center gap-3 bg-[#070907] border border-[#1c231d] focus-within:border-[#9dff1f]/70 focus-within:shadow-[0_0_15px_rgba(157,255,31,0.15)] px-3.5 py-3 transition-all">
            <span className="text-[#9dff1f] font-mono font-bold text-sm">&gt;_</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search challenges, stages, FAQs, tools, navigation..."
              className="flex-1 bg-transparent text-white font-mono text-sm placeholder:text-gray-600 focus:outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-500 hover:text-gray-300 p-1 cursor-pointer transition-colors"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-[#121811] border border-[#1c231d]">
              ESC
            </kbd>
          </div>
        </div>



        {/* Results List (only shown once the user types) */}
        {query.trim() && (
        <div
          ref={resultsContainerRef}
          className="max-h-[380px] sm:max-h-[440px] overflow-y-auto divide-y divide-[#141a13] p-2 bg-[#090d09]"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 px-4 text-center font-mono">
              <p className="text-red-400 text-sm mb-2">&gt; NO TELEMETRY FOUND FOR "{query}"</p>
              <p className="text-gray-500 text-xs max-w-sm mx-auto mb-4">
                Try searching for keywords like "osint", "stego", "flag", "wireshark", "sliit", or "levels".
              </p>
              <button
                onClick={() => setQuery("")}
                className="inline-block bg-[#121811] border border-[#1c231d] hover:border-[#9dff1f] text-[#9dff1f] px-3 py-1.5 text-xs transition-colors cursor-pointer"
              >
                RESET QUERY
              </button>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex
              const isFaqExpanded = expandedFaqId === item.id

              let ItemIcon = Terminal
              if (item.type === "faq") ItemIcon = HelpCircle
              else if (item.type === "nav") ItemIcon = Compass
              else if (item.type === "stage") ItemIcon = item.isUnlocked ? Unlock : Lock
              else if (item.type === "action") {
                if (item.actionType === "login") ItemIcon = LogIn
                else if (item.actionType === "register") ItemIcon = UserPlus
                else if (item.actionType === "logout") ItemIcon = LogOut
                else ItemIcon = Flame
              }

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group p-3 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#121811] border-[#9dff1f]/50 shadow-[inset_3px_0_0_#9dff1f]"
                      : "bg-[#090d09] border-transparent hover:bg-[#0e130e]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`p-1.5 mt-0.5 shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#9dff1f] text-black"
                            : "bg-[#101610] text-[#9dff1f] border border-[#1c231d]"
                        }`}
                      >
                        <ItemIcon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4
                            className={`font-mono text-xs sm:text-sm font-semibold truncate ${
                              isSelected ? "text-[#9dff1f]" : "text-white group-hover:text-gray-200"
                            }`}
                          >
                            {item.title}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border shrink-0 ${
                              item.isUnlocked || item.badge === "LIVE ARENA"
                                ? "bg-[#9dff1f]/10 text-[#9dff1f] border-[#9dff1f]/30"
                                : item.badge === "FLAG SPEC"
                                ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                                : "bg-[#141a14] text-gray-400 border-[#1c231d]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>

                        <p className="text-gray-400 text-xs font-mono line-clamp-2 leading-relaxed">
                          {item.subtitle}
                        </p>

                        {/* Inline FAQ answer or Flag quick-copy */}
                        {item.type === "faq" && item.answer && (
                          <div className="mt-2 pt-2 border-t border-[#182117] flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedFaqId(isFaqExpanded ? null : item.id)
                              }}
                              className="text-[11px] font-mono text-gray-500 hover:text-[#9dff1f] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>{isFaqExpanded ? "▲ Hide Answer" : "▼ Read Quick Briefing"}</span>
                            </button>

                            {item.hasCopyableFlag && (
                              <button
                                type="button"
                                onClick={handleCopyFlagFormat}
                                className="flex items-center gap-1.5 text-[10px] font-mono bg-[#141c14] hover:bg-[#1a251a] text-[#9dff1f] border border-[#9dff1f]/30 px-2 py-0.5 transition-colors cursor-pointer"
                              >
                                {copiedFlag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedFlag ? "COPIED" : "COPY SPEC: Kernel0X{...}"}</span>
                              </button>
                            )}
                          </div>
                        )}

                        {isFaqExpanded && (
                          <div className="mt-2 p-2.5 bg-[#070a07] border border-[#1c231d] text-xs font-mono text-gray-300 leading-relaxed animate-in fade-in duration-100">
                            <span className="text-[#9dff1f] block mb-1">&gt; VERIFIED BRIEFING:</span>
                            {item.answer}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 self-center text-gray-500 group-hover:text-[#9dff1f] transition-colors shrink-0">
                      <span className="text-[10px] font-mono tracking-wider">
                        {item.type === "action" ? "EXEC" : item.type === "faq" ? "VIEW" : "JUMP"}
                      </span>
                      <CornerDownLeft className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        )}
      </div>
    </div>
  )
}
