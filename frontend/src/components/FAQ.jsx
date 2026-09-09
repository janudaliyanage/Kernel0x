import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "How do I participate in the CTF?",
    a: "Register through the sign-up page, then head to the Levels section once the event goes live. Each stage unlocks on its scheduled date.",
  },
  {
    q: "What are the four stages?",
    a: "OSINT, Steganography, Cryptography, and Network — each stage has its own set of challenges worth different points.",
  },
  {
    q: "Will there be any clue for the problem set?",
    a: "Each level includes a short brief and occasional hints. No full walkthroughs — this is a CTF, not a tutorial.",
  },
  {
    q: "What tools would I need to solve the problems?",
    a: "A browser, a terminal, and whatever OSINT/crypto/network tools you're comfortable with. Nothing proprietary is required.",
  },
  {
    q: "Whom do I get in touch with, if I need any technical assistance?",
    a: "Reach out to the moderators listed on the Moderators page, or use the enquiry form in the footer.",
  },
  {
    q: "How and where do I submit the solution to the problem?",
    a: "Flags are submitted directly on each level's page once you've found them.",
  },
  {
    q: "What is the winning criteria?",
    a: "Highest total score across all four stages wins; ties are broken by earliest final submission time.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="relative bg-[#0a0d0a] py-24 px-8 md:px-16">
      <section id="faqs" className="relative bg-[#0a0d0a] py-24 px-8 md:px-16"></section>
      <div className="flex items-center justify-end gap-4 mb-10">
        <div className="w-16 h-1 bg-[#9dff1f]" />
        <span className="text-gray-400 tracking-widest text-sm font-mono">
          //FAQS.
        </span>
      </div>

      <div className="border border-[#1c231d]">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={item.q} className="border-b border-[#1c231d] last:border-b-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-mono text-sm md:text-base">
                  • {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform shrink-0 ml-4 ${
                    isOpen ? "rotate-180 text-[#9dff1f]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed font-mono">
                  {item.a}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}