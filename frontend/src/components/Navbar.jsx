import { Search, Bell, User } from "lucide-react"
import logo from "@/assets/logo1.png"

const navLinks = [
  { name: "HOME", href: "#home" },
  { name: "ABOUT CTF", href: "#about-ctf" },
  { name: "LEVELS", href: "#levels" },
  { name: "FAQS", href: "#faqs" },
]

export default function Navbar() {
  return (
    <nav className="bg-[#0a0d0a] border-b border-[#9dff1f]/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <img src={logo} alt="Kernel0X" className="h-10 w-auto" />
      </div>

      <div className="flex items-center gap-10">
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-heading text-sm tracking-wide text-gray-400 hover:text-[#9dff1f] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5 text-gray-400">
          <Search className="w-5 h-5 cursor-pointer hover:text-[#9dff1f] transition-colors" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-[#9dff1f] transition-colors" />
          <User className="w-5 h-5 cursor-pointer hover:text-[#9dff1f] transition-colors" />
        </div>
      </div>
    </nav>
  )
}