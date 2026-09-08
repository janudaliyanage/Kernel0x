import { useEffect, useState } from "react"

const words = ["WATCH.", "LEARN.", "HACK.", "HAPPY CTF."]

function useTypewriter(list, speed = 90, pause = 1200) {
  const [text, setText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

    useEffect(() => {
    const current = list[wordIndex]

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }

    if (deleting && text === "") {
      setDeleting(false)
      setWordIndex((i) => (i + 1) % list.length)
      return
    }
    const t = setTimeout(() => {
      setText(current.slice(0, deleting ? text.length - 1 : text.length + 1))
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(t)
  }, [text, deleting, wordIndex])

  return text
}

export default function Footer() {
  const typed = useTypewriter(words)

  return (
    <footer className="bg-[#0a0d0a]">
      {/* Typing banner */}
      <div className="min-h-[300px] flex items-center justify-center px-8">
        <p className="font-heading text-white text-3xl md:text-5xl text-center">
          {typed}
          <span className="inline-block w-3 h-8 md:w-4 md:h-10 bg-[#9dff1f] ml-2 align-middle animate-pulse" />
        </p>
      </div>

      {/* Main footer content */}
      <div className="border-t border-[#1c231d] px-8 md:px-16 py-16 grid md:grid-cols-3 gap-12">
        {/* Enquiry form */}
        <div>
          <p className="text-white font-mono text-sm mb-4">Make an enquiry.</p>
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-transparent border border-[#1c231d] text-white text-sm px-4 py-3 mb-3 font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#9dff1f]"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-[#1c231d] text-white text-sm px-4 py-3 mb-3 font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#9dff1f]"
          />
          <button className="w-full bg-[#10140f] border border-[#1c231d] text-gray-400 text-sm font-mono py-3 hover:border-[#9dff1f] hover:text-[#9dff1f] transition-colors">
            SUBMIT
          </button>
        </div>

        {/* Nav links */}
        <div className="md:border-l md:border-[#1c231d] md:pl-12 flex flex-col gap-3">
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">Home</a>
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">About CTF</a>
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">Levels</a>
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">Leaderboard</a>
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">Prizes</a>
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">Moderators</a>
          <a href="#" className="text-gray-400 text-sm font-mono hover:text-[#9dff1f] transition-colors">Faqs</a>
        </div>

        {/* Contact */}
        <div className="md:border-l md:border-[#1c231d] md:pl-12">
          <p className="text-gray-400 text-sm font-mono leading-relaxed mb-4">
            Kernel0x HQ,<br />
            SLIIT Malabe Campus,<br />
            New Kandy Road, Malabe,<br />
            Sri Lanka
          </p>
          <p className="text-gray-500 text-xs font-mono mb-1">
            MAIL: <span className="text-gray-400">ctf@kernel0x.com</span>
          </p>
          <p className="text-gray-500 text-xs font-mono mb-6">
            CALL: <span className="text-gray-400">+94 000 000 0000</span>
          </p>

          {/* Social icons - inline SVGs, no lucide-react brand icon dependency */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.04C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98A8.58 8.58 0 0 1 2 19.54a12.1 12.1 0 0 0 6.29 1.85c7.55 0 11.68-6.25 11.68-11.68 0-.18 0-.35-.01-.53A8.18 8.18 0 0 0 22.46 6z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.14 0-3.5.01-4.73.07-1.03.05-1.6.22-1.97.36-.5.2-.85.42-1.22.79-.37.37-.6.72-.79 1.22-.14.37-.31.94-.36 1.97-.06 1.23-.07 1.6-.07 4.73s.01 3.5.07 4.73c.05 1.03.22 1.6.36 1.97.2.5.42.85.79 1.22.37.37.72.6 1.22.79.37.14.94.31 1.97.36 1.23.06 1.6.07 4.73.07s3.5-.01 4.73-.07c1.03-.05 1.6-.22 1.97-.36.5-.2.85-.42 1.22-.79.37-.37.6-.72.79-1.22.14-.37.31-.94.36-1.97.06-1.23.07-1.6.07-4.73s-.01-3.5-.07-4.73c-.05-1.03-.22-1.6-.36-1.97-.2-.5-.42-.85-.79-1.22-.37-.37-.72-.6-1.22-.79-.37-.14-.94-.31-1.97-.36-1.23-.06-1.6-.07-4.73-.07zm0 4.05a5.17 5.17 0 1 1 0 10.34 5.17 5.17 0 0 1 0-10.34zm0 1.62a3.55 3.55 0 1 0 0 7.1 3.55 3.55 0 0 0 0-7.1zm5.34-3.79a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}