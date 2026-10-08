import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, User, Menu, X, ShieldCheck, LogOut, Terminal } from "lucide-react"
import logo from "@/assets/logo1.png"
import { useAuth } from "@/context/AuthContext"
import { useSearch } from "@/context/SearchContext"

const navLinks = [
  { name: "HOME", href: "/#home" },
  { name: "ABOUT CTF", href: "/#about-ctf" },
  { name: "LEVELS", href: "/#levels" },
  { name: "FAQS", href: "/#faqs" },
]

export default function Navbar() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const { openSearch } = useSearch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-[#0a0d0a]/95 border-b border-[#9dff1f]/30 px-4 sm:px-8 py-3.5 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Kernel0X" className="h-9 sm:h-10 w-auto" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-heading text-sm tracking-widest text-gray-400 hover:text-[#9dff1f] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions (CTF Join / Sign In / Operative Profile) */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/ctf-portal"
                className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-mono font-bold text-xs px-4 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CTF ARENA</span>
              </Link>
              <div className="flex items-center gap-1.5 border border-[#1c231d] bg-[#121811] px-3 py-1.5 font-mono text-xs text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9dff1f]" />
                <span className="text-[#9dff1f] font-semibold">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 font-mono text-xs">
              <button
                onClick={() => openAuthModal("login")}
                className="text-gray-300 hover:text-[#9dff1f] border border-[#1c231d] hover:border-[#9dff1f]/50 px-3.5 py-2 transition-all cursor-pointer"
              >
                [ SIGN IN ]
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="bg-[#9dff1f] hover:bg-[#b0ff42] text-black font-bold px-4 py-2 shadow-[0_0_15px_rgba(157,255,31,0.25)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>JOIN CTF</span>
              </button>
            </div>
          )}

          {/* Search Trigger Button (Bell icon removed) */}
          <div className="flex items-center pl-2 border-l border-[#1c231d]">
            <button
              type="button"
              onClick={openSearch}
              className="flex items-center gap-2 p-1.5 text-gray-400 hover:text-[#9dff1f] hover:bg-[#121811] border border-transparent hover:border-[#9dff1f]/30 transition-all cursor-pointer group"
              title="Search CTF Matrix [Ctrl+K]"
              aria-label="Search CTF"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-[#070907] border border-[#1c231d] group-hover:border-[#9dff1f]/40 group-hover:text-gray-300 transition-colors">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle & Search */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openSearch}
            className="p-2 text-gray-400 hover:text-[#9dff1f] transition-colors cursor-pointer"
            aria-label="Search CTF Matrix"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <Link
              to="/ctf-portal"
              className="bg-[#9dff1f] text-black font-mono font-bold text-[11px] px-3 py-1.5 flex items-center gap-1"
            >
              <span>ARENA</span>
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal("register")}
              className="bg-[#9dff1f] text-black font-mono font-bold text-[11px] px-3 py-1.5"
            >
              JOIN CTF
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-[#9dff1f] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1c231d] bg-[#0a0d0a] mt-3 pt-4 pb-6 px-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile search bar */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              openSearch()
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#101610] border border-[#1c231d] hover:border-[#9dff1f]/50 text-gray-400 hover:text-[#9dff1f] font-mono text-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#9dff1f]" />
              <span>SEARCH KERNEL0X MATRIX...</span>
            </span>
            <kbd className="text-[10px] bg-[#070907] px-1.5 py-0.5 border border-[#1c231d] text-gray-500">
              Ctrl K
            </kbd>
          </button>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleNavClick}
                className="font-heading text-base tracking-wider text-gray-300 hover:text-[#9dff1f] py-1 border-b border-[#141a13] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1c231d] space-y-2.5 font-mono text-xs">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-gray-400 py-1">
                  <span>Operative: <strong className="text-[#9dff1f]">{user?.username}</strong></span>
                  <span className="text-[10px] text-gray-500">{user?.teamName || "Solo"}</span>
                </div>
                <Link
                  to="/ctf-portal"
                  onClick={handleNavClick}
                  className="w-full bg-[#9dff1f] text-black font-bold py-2.5 flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  <span>ENTER CTF ARENA</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full border border-red-500/40 text-red-400 py-2 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openAuthModal("login")
                  }}
                  className="w-full border border-[#1c231d] text-gray-300 py-2.5 text-center hover:border-[#9dff1f]"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openAuthModal("register")
                  }}
                  className="w-full bg-[#9dff1f] text-black font-bold py-2.5 text-center"
                >
                  JOIN CTF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}