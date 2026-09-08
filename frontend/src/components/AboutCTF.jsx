import brainJar from "@/assets/brainjar.png"

export default function AboutCTF() {
  return (
    <section className="relative bg-[#0a0d0a] min-h-screen overflow-hidden px-8 md:px-16 flex items-center">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left: text */}
        <div>
          <p className="font-mono text-[#9dff1f] text-sm mb-4">
            &gt; loading briefing.txt...
          </p>
          <h2
            data-text="ABOUT CTF"
            className="glitch-text font-heading text-7xl md:text-9xl text-white mb-6"
          >
            ABOUT CTF
          </h2>
          <p className="text-gray-400 max-w-md leading-relaxed mb-6">
            Kernel0X is a capture-the-flag event testing your skills across
            OSINT, cryptography, steganography, networking, and live
            exploitation. Four stages, six questions, one shot at the flag.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-1 bg-[#9dff1f]" />
            <span className="font-mono text-gray-500 text-sm">
              access_level: participant
            </span>
          </div>
        </div>
        <div className="flex justify-end pr-16 md:pr-32">
  <img
    src={brainJar}
    alt="Kernel0x specimen jar"
    className="w-72 md:w-96 h-auto animate-float drop-shadow-[0_0_25px_rgba(157,255,31,0.35)]"
  />
</div>
      </div>
    </section>
  )
}