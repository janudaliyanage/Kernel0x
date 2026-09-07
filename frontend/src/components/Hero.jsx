export default function Hero() {
  return (
    <section className="relative bg-[#151c21] overflow-hidden min-h-[600px]">
      {/* Background: 3D Spline scene, positioned left, faded into background */}
<div
  className="absolute top-1/2 right-[2%] -translate-y-1/2 w-[650px] h-[650px] opacity-50"
  style={{
    maskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 75%)',
  }}
>
        <spline-viewer
          url="https://prod.spline.design/HeOqga2-WDqf3EkX/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        ></spline-viewer>
      </div>

      {/* Foreground text, pointer-events-none on the wrapper so empty space doesn't block the scene below */}
      <div className="relative z-10 grid md:grid-cols-2 items-center min-h-[600px] px-8 md:px-16 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="font-heading text-5xl md:text-6xl text-white leading-tight mb-4">
            WELCOME TO<br />THE KERNEL0X.
          </h1>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-1 bg-[#dc1327]" />
            <span className="text-gray-400 tracking-widest text-sm">
              //SEP/2026.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative z-10 bg-[#dc1327] px-8 md:px-16 py-6 flex items-center gap-12">
        <div>
          <p className="text-white/80 text-xs font-semibold">STAGES</p>
          <p className="text-white text-2xl font-bold">04</p>
        </div>
        <div>
          <p className="text-white/80 text-xs font-semibold">QUESTIONS</p>
          <p className="text-white text-2xl font-bold">06</p>
        </div>
      </div>
    </section>
  )
}