import { useNavigate } from "react-router-dom"
import { Lock, ArrowRight, Unlock } from "lucide-react"
import brainJar from "@/assets/flag.png"
import skeleton from "@/assets/skeleton.png"
import { useAuth } from "@/context/AuthContext"

const levels = [
  {
    number: "02",
    title: "STEGANOGRAPHY.",
    note: "UNLOCKING ON 15TH SEP",
    variant: "dark",
  },
  {
    number: "03",
    title: "CRYPTOGRAPHY.",
    note: "UNLOCKING ON 22ND SEP",
    variant: "dark",
  },
  {
    number: "04",
    title: "NETWORK.",
    note: "UNLOCKING ON 29TH SEP",
    variant: "highlight",
  },
  {
    number: "??",
    title: "CLASSIFIED.",
    note: "STAGE 05 / 06 FINALS",
    variant: "closed",
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
          <div className="relative bg-[#10140f] border border-[#1c231d] flex flex-col justify-end p-6 sm:p-8 min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src={brainJar}
                alt="Kernel0x specimen flag"
                className="w-1/2 sm:w-2/3 max-w-[320px] h-auto animate-float opacity-80 drop-shadow-[0_0_30px_rgba(157,255,31,0.35)]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#10140f] via-[#10140f]/60 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 font-mono text-[#9dff1f] text-xs mb-1">
                <Unlock size={14} />
                <span>ACTIVE STAGE UNLOCKED</span>
              </div>
              <p className="font-heading text-white text-4xl sm:text-5xl mb-2 sm:mb-4">01</p>
              <h3 className="font-heading text-[#9dff1f] text-3xl sm:text-4xl mb-2">
                OSINT.
              </h3>
              <p className="font-mono text-gray-400 text-xs sm:text-sm mb-6">
                OPEN SOURCE RECONNAISSANCE // TIME REMAINING: 23:55:22
              </p>
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
                  className={`relative p-6 flex flex-col justify-center min-h-[160px] sm:min-h-[190px] border border-[#1c231d] ${
                    isHighlight
                      ? "bg-[#9dff1f]"
                      : isClosed
                      ? "bg-[#0d100c]"
                      : "bg-[#10140f]"
                  }`}
                >
                  {!isClosed && (
                    <Lock
                      size={18}
                      className={`absolute top-6 right-6 ${
                        isHighlight ? "text-black/40" : "text-gray-600"
                      }`}
                    />
                  )}
                  <p
                    className={`font-mono text-xs mb-1 ${
                      isHighlight
                        ? "text-black/60"
                        : isClosed
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  >
                    LEVEL
                  </p>
                  <p
                    className={`font-heading text-2xl sm:text-3xl mb-1 sm:mb-2 ${
                      isHighlight
                        ? "text-black"
                        : isClosed
                        ? "text-gray-600"
                        : "text-white"
                    }`}
                  >
                    {level.number}
                  </p>
                  <h4
                    className={`font-heading text-xl sm:text-2xl mb-2 ${
                      isHighlight
                        ? "text-black"
                        : isClosed
                        ? "text-gray-500"
                        : "text-[#9dff1f]"
                    }`}
                  >
                    {level.title}
                  </h4>
                  <p
                    className={`font-mono text-xs ${
                      isHighlight ? "text-black/70 font-semibold" : "text-gray-400"
                    }`}
                  >
                    {level.note}
                  </p>
                  {isHighlight && (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-black/80 mt-3 font-semibold">
                      stage preview <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Skeleton pixel art - responsive visibility */}
      <img
        src={skeleton}
        alt=""
        className="hidden sm:block absolute left-0 bottom-4 md:bottom-16 w-32 sm:w-44 md:w-56 h-auto opacity-60 -translate-x-1/4 pointer-events-none"
      />
    </section>
  )
}