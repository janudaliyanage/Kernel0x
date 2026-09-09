import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const outerRef = useRef(null)
  const [dot, setDot] = useState({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      setDot({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMove)

    let frame
    const animate = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.15
      ring.current.y += (target.current.y - ring.current.y) * 0.15
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      }
      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      {/* Outer ring - trails slightly behind */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white pointer-events-none z-[9999]"
      />
      {/* Inner dot - follows instantly */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999]"
        style={{ transform: `translate(${dot.x - 4}px, ${dot.y - 4}px)` }}
      />
    </>
  )
}