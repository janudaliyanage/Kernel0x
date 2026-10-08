import { useNavigate } from "react-router-dom"
import { Lock, ArrowRight, Unlock } from "lucide-react"
import brainJar from "@/assets/flag.png"
import { useAuth } from "@/context/AuthContext"

const level01 = {
  number: "01",
  title: "OSINT.",
  subtitle: "OPEN SOURCE RECONNAISSANCE // TIME REMAINING: 23:55:22",
  difficulty: "1 - Easiest",
  difficultyDot: "bg-emerald-400",
  stars: 2,
  points: [
    "Low barrier to entry",
    "Teaches real-world information-gathering skills",
    "Used in actual penetration testing engagements",
  ],
}

const levels = [
  {
    number: "02",
    title: "STEGANOGRAPHY.",
    variant: "dark",
    difficulty: "2",
    difficultyDot: "bg-emerald-400",
    stars: 3,
    points: [
      "Common in beginner CTFs",
      "Tools like steghide and zsteg are accessible enough for campus skill levels",
      "Teaches real file-analysis fundamentals",
    ],
  },
  {
    number: "03",
    title: "CRYPTOGRAPHY.",
    variant: "dark",
    difficulty: "3",
    difficultyDot: "bg-amber-400",
    stars: 4,
    points: [
      "Reinforces core security theory (confidentiality, why weak ciphers are risky) covered in the module",
      "Solvable with tools we already use like CyberChef",
    ],
  },
  {
    number: "04",
    title: "NETWORK.",
    variant: "dark",
    difficulty: "4 - Hardest",
    difficultyDot: "bg-rose-500",
    stars: 5,
    points: [
      "Builds practical packet-analysis skills with Wireshark",
      "Directly relevant to network security and incident response work",
    ],
  },
  {
    number: "??",
    title: "CLASSIFIED.",
    note: "STAGE 05 / 06 FINALS",
    variant: "closed",
    difficulty: "Classified",
    difficultyDot: "bg-gray-600",
    stars: null,
    points: [
      "Multi-vector championship challenge set",
      "Advanced exploit chain integrating all security domains",
    ],
  },
]

export default function Levels() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const navigate = useNavigate()

  const handleStartLevel = () => {
    if (isAuthenticated) {
      navigate("/ctf-portal")
    } else {
      openAuthModal("register")
    }
  }

  return (
    <section id="levels" className="relative bg-[#0a0d0a] min-h-screen overflow-hidden px-4 sm:px-8 md:px-16 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[#9dff1f] text-xs sm:text-sm mb-3 sm:mb-4">
          &gt; loading levels.db...
        </p>
        <h2
          data-text="LEVELS"
          className="glitch-text font-heading text-5xl sm:text-7xl md:text-8xl text-white mb-8 sm:mb-10 leading-none"
        >
          LEVELS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1fr] gap-3 lg:gap-1">
          {/* Level 01 Active Stage Card */}
          <div className="relative bg-[#10140f] border border-[#1c231d] flex flex-col justify-end p-6 sm:p-8 min-h-[460px] sm:min-h-[520px] lg:min-h-[620px] overflow-hidden">
            <div className="absolute inset-0 flex items-start justify-center pt-3 sm:pt-6 lg:pt-8 pointer-events-none">
              <img
                src={brainJar}
                alt="Kernel0x specimen flag"
                className="w-1/2 sm:w-3/5 max-w-[340px] sm:max-w-[380px] h-auto animate-float opacity-90 drop-shadow-[0_0_35px_rgba(157,255,31,0.45)]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#10140f] via-[#10140f]/50 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2 font-mono text-[#9dff1f] text-xs">
                  <Unlock size={14} />
                  <span>ACTIVE STAGE UNLOCKED</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs bg-[#0a0d0a]/90 border border-[#1c231d] px-2.5 py-1">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    {level01.difficulty}
                  </span>
                  <span className="text-yellow-400 text-xs tracking-wider">
                    {"★".repeat(level01.stars)}
                  </span>
                </div>
              </div>

              <p className="font-heading text-white text-4xl sm:text-5xl mb-1 sm:mb-2">{level01.number}</p>
              <h3 className="font-heading text-[#9dff1f] text-3xl sm:text-4xl mb-1.5">
                {level01.title}
              </h3>
              <p className="font-mono text-gray-400 text-xs sm:text-sm mb-4">
                {level01.subtitle}
              </p>

              {/* Domain Justification Box */}
              <div className="mb-5 p-3.5 bg-[#0a0e0a]/90 border border-[#9dff1f]/30 font-mono">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2 pb-1.5 border-b border-[#1c231d]">
                  <span className="text-[#9dff1f] font-bold uppercase tracking-wider">
                    &gt; DOMAIN JUSTIFICATION:
                  </span>
                  <span className="text-gray-400">DIFF: {level01.difficulty}</span>
                </div>
                <ul className="space-y-2 text-xs">
                  {level01.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#9dff1f] font-bold text-sm leading-none mt-0.5">•</span>
                      <span className="text-gray-200">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleStartLevel}
                className="inline-flex items-center gap-2 bg-[#9dff1f] hover:bg-[#b0ff42] text-black text-xs sm:text-sm font-mono font-bold px-6 py-3 transition-colors cursor-pointer shadow-[0_0_15px_rgba(157,255,31,0.25)]"
              >
                <span>{isAuthenticated ? "ACCESS CTF ARENA" : "JOIN & SOLVE LEVEL 01"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Subsequent Levels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-1">
            {levels.map((level) => {
              const isClosed = level.variant === "closed"
              const isHighlight = level.variant === "highlight"

              return (
                <div
                  key={level.number}
                  className={`relative p-5 sm:p-6 flex flex-col justify-between min-h-[250px] sm:min-h-[275px] border border-[#1c231d] ${
                    isHighlight
                      ? "bg-[#9dff1f]"
                      : isClosed
                      ? "bg-[#0d100c]"
                      : "bg-[#10140f]"
                  }`}
                >
                  {/* Top Header of Card */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-mono text-xs ${
                          isHighlight
                            ? "text-black/70 font-semibold"
                            : isClosed
                            ? "text-gray-600"
                            : "text-gray-500"
                        }`}
                      >
                        LEVEL {level.number}
                      </span>

                      <div className="flex items-center gap-2">
                        {level.difficulty && (
                          <div
                            className={`flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 border ${
                              isHighlight
                                ? "bg-black/10 border-black/20 text-black font-semibold"
                                : isClosed
                                ? "bg-transparent border-[#1c231d] text-gray-600"
                                : "bg-[#0c100c] border-[#1c231d] text-gray-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${level.difficultyDot}`}
                            />
                            <span>{level.difficulty}</span>
                            {level.stars && (
                              <span
                                className={`ml-1 text-xs tracking-wider ${
                                  isHighlight ? "text-black" : "text-yellow-400"
                                }`}
                              >
                                {"★".repeat(level.stars)}
                              </span>
                            )}
                          </div>
                        )}

                        {!isClosed && (
                          <Lock
                            size={16}
                            className={isHighlight ? "text-black/60" : "text-gray-600"}
                          />
                        )}
                      </div>
                    </div>

                    <h4
                      className={`font-heading text-xl sm:text-2xl mb-2 ${
                        isHighlight
                          ? "text-black font-bold"
                          : isClosed
                          ? "text-gray-500"
                          : "text-[#9dff1f]"
                      }`}
                    >
                      {level.title}
                    </h4>

                    {/* Domain Justification Box */}
                    <div
                      className={`p-3 my-2.5 font-mono text-xs border ${
                        isHighlight
                          ? "bg-black/10 border-black/25 text-black"
                          : isClosed
                          ? "bg-[#090c09] border-[#161c16] text-gray-600"
                          : "bg-[#0a0e0a] border-[#1c231d] text-gray-300"
                      }`}
                    >
                      <div className="text-[10px] mb-2 pb-1 border-b border-current/15 opacity-80 font-bold uppercase tracking-wider">
                        &gt; {isClosed ? "FINALS OBJECTIVES:" : "DOMAIN JUSTIFICATION:"}
                      </div>

                      <ul className="space-y-1.5 text-xs">
                        {level.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span
                              className={`font-bold select-none leading-none mt-0.5 ${
                                isHighlight
                                  ? "text-black"
                                  : isClosed
                                  ? "text-gray-600"
                                  : "text-[#9dff1f]"
                              }`}
                            >
                              •
                            </span>
                            <span
                              className={
                                isHighlight
                                  ? "text-black/90 font-medium"
                                  : isClosed
                                  ? "text-gray-500"
                                  : "text-gray-300"
                              }
                            >
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Note */}
                  {level.note && (
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <p className="font-mono text-xs text-gray-400">{level.note}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}