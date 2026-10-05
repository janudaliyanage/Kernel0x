import brainJar from "@/assets/brainjar.png"
import skeleton from "@/assets/skeleton.png"

export default function AboutCTF() {
  return (
    <section id="about-ctf" className="relative bg-[#0a0d0a] min-h-screen overflow-hidden px-4 sm:px-8 md:px-16 py-16 md:py-24 flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center w-full">
        {/* Left: text */}
        <div>
          <p className="font-mono text-[#9dff1f] text-xs sm:text-sm mb-3 sm:mb-4">
            &gt; loading briefing.txt...
          </p>
          <h2
            data-text="ABOUT CTF"
            className="glitch-text font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white mb-6 leading-none"
          >
            ABOUT CTF
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg leading-relaxed mb-6 font-mono">
            Kernel0X is a progressive Capture The Flag event engineered for practical cybersecurity mastery.
            Test your skills across OSINT reconnaissance, concealed steganography payloads, cryptographic cipher analysis,
            and live containerized network exploitation. Four distinct stages, six challenging questions, one coveted championship flag.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 sm:w-16 h-1 bg-[#9dff1f]" />
            <span className="font-mono text-gray-500 text-xs sm:text-sm">
              ACCESS_LEVEL: PARTICIPANT_ENLISTED
            </span>
          </div>
        </div>

        {/* Right: Jar specimen graphic */}
        <div className="flex justify-center md:justify-end pr-0 md:pr-12 lg:pr-24">
          <img
            src={brainJar}
            alt="Kernel0x specimen jar"
            className="w-56 sm:w-72 md:w-80 lg:w-96 h-auto animate-float drop-shadow-[0_0_35px_rgba(157,255,31,0.35)]"
          />
        </div>
      </div>

      {/* Skeleton pixel art - responsive visibility and positioning */}
      <img
        src={skeleton}
        alt=""
        className="hidden sm:block absolute right-0 bottom-4 md:bottom-0 w-32 sm:w-44 md:w-56 h-auto opacity-60 translate-x-1/4 pointer-events-none"
      />
    </section>
  )
}