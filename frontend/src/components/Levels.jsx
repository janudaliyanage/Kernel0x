import { Lock, ArrowRight } from "lucide-react"
import brainJar from "@/assets/brainjar.png"

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
    note: "IS CLOSED",
    variant: "closed",
  },
]

export default function Levels() {
  return (
    <section className="relative bg-[#0a0d0a] min-h-screen px-8 md:px-16 py-16">
      <p className="font-mono text-[#9dff1f] text-sm mb-4">
        &gt; loading levels.db...
      </p>
      <h2
        data-text="LEVELS"
        className="glitch-text font-heading text-6xl md:text-8xl text-white mb-10"
      >
        LEVELS
      </h2>

      <div
        className="grid md:grid-cols-[0.8fr_1fr] gap-1"
        style={{ minHeight: "600px" }}
      >
        {/* Featured / currently unlocked level */}
        <div className="relative bg-[#10140f] flex flex-col justify-end p-8 min-h-[400px] md:min-h-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={brainJar}
              alt="Kernel0x specimen jar"
              className="w-2/3 h-auto animate-float opacity-90 drop-shadow-[0_0_25px_rgba(157,255,31,0.35)]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#10140f] via-[#10140f]/30 to-transparent" />

          <div className="relative z-10">
            <p className="font-mono text-gray-400 text-sm mb-1">LEVEL</p>
            <p className="font-heading text-white text-5xl mb-4">01</p>
            <h3 className="font-heading text-[#9dff1f] text-3xl md:text-4xl mb-2">
              OSINT.
            </h3>
            <p className="font-mono text-gray-500 text-sm mb-6">
              UNLOCKED // TIME LEFT/23:55:22
            </p>
            <button className="inline-flex items-center gap-2 bg-[#9dff1f] text-black text-sm font-semibold px-6 py-3">
              LET'S BEGIN <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 2x2 grid of remaining levels */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          {levels.map((level) => {
            const isClosed = level.variant === "closed"
            const isHighlight = level.variant === "highlight"

            return (
              <div
                key={level.number}
                className={`relative p-6 flex flex-col justify-center min-h-[180px] ${
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
                  className={`font-heading text-2xl mb-2 ${
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
                  className={`font-heading text-xl mb-2 ${
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
                    isHighlight ? "text-black/60" : "text-gray-600"
                  }`}
                >
                  {level.note}
                </p>
                {isHighlight && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-black/70 mt-3">
                    more details <ArrowRight size={12} />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}