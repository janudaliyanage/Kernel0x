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
  }, [text, deleting, wordIndex, list, pause, speed])

  return text
}

export default function Footer() {
  const typed = useTypewriter(words)
  const [enquiry, setEnquiry] = useState({ name: "", email: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleEnquiry = (e) => {
    e.preventDefault()
    if (!enquiry.name || !enquiry.email) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEnquiry({ name: "", email: "" })
    }, 4000)
  }

  return (
    <footer className="bg-[#0a0d0a] border-t border-[#1c231d]/60">
      {/* Typing banner */}
      <div className="min-h-[200px] sm:min-h-[260px] flex items-center justify-center px-4 sm:px-8 py-10">
        <p className="font-heading text-white text-2xl sm:text-4xl md:text-5xl text-center tracking-wider">
          {typed}
          <span className="inline-block w-2.5 h-6 sm:w-4 sm:h-10 bg-[#9dff1f] ml-2 align-middle animate-pulse" />
        </p>
      </div>

      {/* Main footer content */}
      <div className="border-t border-[#1c231d] px-4 sm:px-8 md:px-16 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Enquiry form */}
          <div>
            <p className="text-white font-mono text-sm mb-4">Make an enquiry.</p>
            {submitted ? (
              <div className="p-4 bg-[#9dff1f]/10 border border-[#9dff1f]/40 text-[#9dff1f] font-mono text-xs">
                &gt; Transmission received. A moderator will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleEnquiry}>
                <input
                  type="text"
                  required
                  placeholder="Operative Name"
                  value={enquiry.name}
                  onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                  className="w-full bg-transparent border border-[#1c231d] text-white text-xs sm:text-sm px-4 py-3 mb-3 font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#9dff1f]"
                />
                <input
                  type="email"
                  required
                  placeholder="Official Email"
                  value={enquiry.email}
                  onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                  className="w-full bg-transparent border border-[#1c231d] text-white text-xs sm:text-sm px-4 py-3 mb-3 font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#9dff1f]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#10140f] border border-[#1c231d] text-gray-400 text-xs sm:text-sm font-mono py-3 hover:border-[#9dff1f] hover:text-[#9dff1f] transition-colors cursor-pointer"
                >
                  DISPATCH ENQUIRY
                </button>
              </form>
            )}
          </div>

          {/* Nav links */}
          <div className="md:border-l md:border-[#1c231d] md:pl-8 lg:pl-12 flex flex-col gap-2.5">
            <span className="font-mono text-xs text-[#9dff1f] font-semibold mb-1">// NAVIGATION</span>
            <a href="/#home" className="text-gray-400 text-xs sm:text-sm font-mono hover:text-[#9dff1f] transition-colors">Home</a>
            <a href="/#about-ctf" className="text-gray-400 text-xs sm:text-sm font-mono hover:text-[#9dff1f] transition-colors">About CTF</a>
            <a href="/#levels" className="text-gray-400 text-xs sm:text-sm font-mono hover:text-[#9dff1f] transition-colors">Levels &amp; Stages</a>
            <a href="/ctf-portal" className="text-gray-400 text-xs sm:text-sm font-mono hover:text-[#9dff1f] transition-colors">Active CTF Arena</a>
            <a href="/#faqs" className="text-gray-400 text-xs sm:text-sm font-mono hover:text-[#9dff1f] transition-colors">FAQs</a>
          </div>

          {/* Contact */}
          <div className="md:border-l md:border-[#1c231d] md:pl-8 lg:pl-12">
            <span className="font-mono text-xs text-[#9dff1f] font-semibold block mb-3">// HEADQUARTERS</span>
            <p className="text-gray-400 text-xs sm:text-sm font-mono leading-relaxed mb-4">
              Kernel0X HQ,<br />
              SLIIT Malabe Campus,<br />
              New Kandy Road, Malabe,<br />
              Sri Lanka
            </p>
            <p className="text-gray-500 text-xs font-mono mb-1">
              MAIL: <span className="text-gray-400">ctf@kernel0x.com</span>
            </p>
            <p className="text-gray-500 text-xs font-mono mb-6">
              FLAG_SPEC: <span className="text-[#9dff1f]">Kernel0X&#123;...&#125;</span>
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.04C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98A8.58 8.58 0 0 1 2 19.54a12.1 12.1 0 0 0 6.29 1.85c7.55 0 11.68-6.25 11.68-11.68 0-.18 0-.35-.01-.53A8.18 8.18 0 0 0 22.46 6z"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-500 hover:text-[#9dff1f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}