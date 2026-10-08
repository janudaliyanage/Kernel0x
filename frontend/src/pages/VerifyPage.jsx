import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function VerifyPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/ctf-portal", { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#070907] flex items-center justify-center font-mono text-sm text-[#9dff1f]">
      ENTERING KERNEL0X CTF PORTAL...
    </div>
  )
}
