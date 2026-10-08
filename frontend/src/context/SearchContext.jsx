import { createContext, useContext, useState, useEffect, useCallback } from "react"

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = useCallback(() => setIsOpen(true), [])
  const closeSearch = useCallback(() => setIsOpen(false), [])
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), [])

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, and '/')
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }

      // Open on '/' when not typing inside an input/textarea
      if (
        e.key === "/" &&
        !isOpen &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) &&
        !document.activeElement?.isContentEditable
      ) {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
