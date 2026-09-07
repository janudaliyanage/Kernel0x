import { Search, Bell, User, ArrowRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import logo from "@/assets/logo1.png"

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "ABOUT CTF", path: "/about" },
  { name: "LEVELS", path: "/levels" },
  { name: "LEADERBOARD", path: "/leaderboard" },
  { name: "PRIZES", path: "/prizes" },
  { name: "MODERATORS", path: "/moderators" },
  { name: "FAQS", path: "/faqs" },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-black border-b border-[#dc1327]/30 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Kernel0X" className="h-10 w-auto" />
      </div>

      {/* Right side: nav links + icons */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-heading flex items-center gap-1 text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-[#dc1327]"
                    : "text-gray-300 hover:text-[#dc1327]"
                }`}
              >
                {isActive && <ArrowRight className="w-4 h-4" />}
                {link.name}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-5 text-gray-300">
          <Search className="w-5 h-5 cursor-pointer hover:text-[#dc1327] transition-colors" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-[#dc1327] transition-colors" />
          <User className="w-5 h-5 cursor-pointer hover:text-[#dc1327] transition-colors" />
        </div>
      </div>
    </nav>
  )
}