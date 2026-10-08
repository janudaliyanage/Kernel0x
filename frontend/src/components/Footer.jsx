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
    <footer id="contact" className="bg-[#0a0d0a] border-t border-[#1c231d]/60">
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
            <p className="text-gray-500 text-xs font-mono">
              FLAG_SPEC: <span className="text-[#9dff1f]">Kernel0X&#123;...&#125;</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}