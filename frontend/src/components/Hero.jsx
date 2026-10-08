import { Link } from "react-router-dom"
import { ArrowRight, Terminal, ShieldCheck } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function Hero() {
  const { isAuthenticated, user, openAuthModal } = useAuth()

  return (
    <section id="home" className="relative bg-[#0a0d0a] overflow-hidden min-h-[92vh] flex flex-col justify-between">
      {/* Background Spline 3D Scene */}
      <div
        className="absolute inset-0 opacity-40 flex items-center justify-center pointer-events-none"
        style={{ filter: "hue-rotate(70deg) saturate(3) brightness(0.9)" }}
      >
        <div className="w-[120%] sm:w-[100%] aspect-square rounded-full overflow-hidden">
          <spline-viewer
            url="https://prod.spline.design/HeOqga2-WDqf3EkX/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          ></spline-viewer>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center px-4 sm:px-8 md:px-16 py-12">
        <div className="max-w-3xl">
          <p className="font-mono text-[#9dff1f] text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#9dff1f] animate-ping" />
            <span>&gt; connecting to kernel0x_node...</span>
          </p>

          <h1
            data-text="KERNEL0X"
            className="glitch-text font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none mb-6 tracking-tight select-none"
          >
            KERNEL0X
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-xl font-mono leading-relaxed mb-6">
            The premier campus cybersecurity Capture The Flag challenge. Investigate live multi-domain scenarios across OSINT, Steganography, Cryptography, and Network Exploitation.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {isAuthenticated ? (
              <Link
                to="/ctf-portal"
                className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-sm px-6 sm:px-8 py-3.5 flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(157,255,31,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>ENTER CTF ARENA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal("register")}
                  className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-sm px-6 sm:px-8 py-3.5 flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(157,255,31,0.3)] hover:scale-[1.02] cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>JOIN CTF EVENT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openAuthModal("login")}
                  className="border border-[#1c231d] hover:border-[#9dff1f] text-gray-300 hover:text-[#9dff1f] bg-[#0a0d0a]/70 font-mono text-sm px-6 py-3.5 transition-colors cursor-pointer"
                >
                  [ OPERATIVE SIGN IN ]
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Stats bar - terminal style, green, diagonal top edge */}
      <div
        className="relative z-10 bg-[#9dff1f] px-4 sm:px-8 md:px-16 py-4 sm:py-6 flex flex-wrap items-center justify-between gap-4 sm:gap-12"
        style={{ clipPath: "polygon(0 8px, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div className="flex items-center gap-6 sm:gap-12">
          <div>
            <p className="font-mono text-black/70 text-[10px] sm:text-xs uppercase font-semibold">stages</p>
            <p className="text-black text-xl sm:text-3xl font-bold font-heading">04</p>
          </div>
          <div>
            <p className="font-mono text-black/70 text-[10px] sm:text-xs uppercase font-semibold">questions</p>
            <p className="text-black text-xl sm:text-3xl font-bold font-heading">06</p>
          </div>
          <div>
            <p className="font-mono text-black/70 text-[10px] sm:text-xs uppercase font-semibold">flag format</p>
            <p className="text-black text-sm sm:text-lg font-mono font-bold">Kernel0X&#123;...&#125;</p>
          </div>
        </div>
      </div>
    </section>
  )
}