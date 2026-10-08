import { useState, useEffect } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    q: "How do I participate in the CTF?",
    a: "Click 'JOIN CTF' to enlist with your codename and university/official email. Complete the 6-digit email verification step to instantly activate your credentials and enter the competition portal.",
  },
  {
    q: "Why is email verification required?",
    a: "Email verification ensures one operative account per participant, authenticates official campus eligibility, and delivers security tokens and hint broadcasts directly to your inbox.",
  },
  {
    q: "What are the four stages?",
    a: "OSINT (Stage 1), Steganography (Stage 2), Cryptography (Stage 3), and Network Exploitation (Stage 4). Each stage unlocks sequentially and features real-world scenario challenges.",
  },
  {
    q: "Will there be clues for the problem set?",
    a: "Each challenge includes a tactical briefing and contextual hints. Solvers must formulate their own exploitation strategies to capture the flag.",
  },
  {
    q: "What tools do I need to solve the problems?",
    a: "A standard browser, a Linux or Unix terminal, and standard network/crypto analysis utilities (e.g. Wireshark, CyberChef, Steghide, Exiftool). No proprietary paid tools required.",
  },
  {
    q: "Whom do I get in touch with for technical assistance?",
    a: "Reach out to the moderators listed in the footer, or submit a query using the briefing form on this welcome page.",
  },
  {
    q: "What is the flag format and submission process?",
    a: "All flags follow the format Kernel0X{string_here}. Once you uncover a flag, enter it directly into the flag submission box on the active CTF portal page.",
  },
  {
    q: "What is the winning criteria?",
    a: "Operatives are ranked by total points accrued across all solved stages. Ties are resolved by the earliest verified flag submission timestamp.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const handleOpenFaq = (e) => {
      if (typeof e.detail === "number" && e.detail >= 0 && e.detail < faqs.length) {
        setOpenIndex(e.detail)
        const el = document.getElementById(`faq-item-${e.detail}`)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }
    window.addEventListener("kernel0x:open-faq", handleOpenFaq)
    return () => window.removeEventListener("kernel0x:open-faq", handleOpenFaq)
  }, [])

  return (
    <section id="faqs" className="relative bg-[#0a0d0a] py-16 sm:py-24 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-2 font-mono text-xs text-[#9dff1f]">
            <HelpCircle className="w-4 h-4" />
            <span>OPERATIONAL BRIEFING</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 sm:w-16 h-1 bg-[#9dff1f]" />
            <span className="text-gray-400 tracking-widest text-xs sm:text-sm font-mono">
              // FAQS.SYS
            </span>
          </div>
        </div>

        <div className="border border-[#1c231d]">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={item.q}
                id={`faq-item-${i}`}
                className="border-b border-[#1c231d] last:border-b-0 bg-[#0c100c]/60 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left transition-colors hover:bg-[#121811] cursor-pointer"
                >
                  <span className="text-white font-mono text-xs sm:text-sm md:text-base pr-4">
                    <span className="text-[#9dff1f] mr-2">[{i + 1}]</span> {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform shrink-0 ${
                      isOpen ? "rotate-180 text-[#9dff1f]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 text-gray-400 text-xs sm:text-sm leading-relaxed font-mono border-t border-[#1c231d]/60 bg-[#080b08]">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}