export default function Hero() {
  return (
    <section className="relative bg-[#0a0d0a] overflow-hidden min-h-screen flex flex-col">
      <div
        className="absolute inset-0 opacity-40 flex items-center justify-center"
        style={{ filter: 'hue-rotate(70deg) saturate(3) brightness(0.9)' }}
      >
      <div className="w-[100%] aspect-square rounded-full overflow-hidden">
          <spline-viewer
            url="https://prod.spline.design/HeOqga2-WDqf3EkX/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          ></spline-viewer>
        </div>
      </div>
      {/* Text content */}
      <div className="relative z-10 flex-1 grid md:grid-cols-2 items-center px-8 md:px-16 pointer-events-none">
        <div className="pointer-events-auto">
          <p className="font-mono text-[#9dff1f] text-sm tracking-wide mb-4">
            &gt; connecting to kernel0x_node...
          </p>
          <h1
            data-text="KERNEL0X"
            className="glitch-text font-heading text-6xl md:text-9xl text-white leading-none mb-6"
          >
            KERNEL0X
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-1 bg-[#9dff1f]" />
            <span className="font-mono text-gray-400 text-sm">sep / 2026</span>
          </div>
        </div>
      </div>

      {/* Stats bar - terminal style, green, diagonal top edge */}
      <div
        className="relative z-10 bg-[#9dff1f] px-8 md:px-16 py-6 flex items-center gap-12"
        style={{ clipPath: 'polygon(0 12px, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div>
          <p className="font-mono text-black/70 text-xs">stages</p>
          <p className="text-black text-2xl font-bold">04</p>
        </div>
        <div>
          <p className="font-mono text-black/70 text-xs">questions</p>
          <p className="text-black text-2xl font-bold">06</p>
        </div>
      </div>
    </section>
  )
}