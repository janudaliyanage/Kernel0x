import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { SearchProvider } from "./context/SearchContext"
import Navbar from "./components/Navbar"
import Welcome from "./pages/Welcome"
import CTFPortal from "./pages/CTFPortal"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import VerifyPage from "./pages/VerifyPage"
import CustomCursor from "./components/CustomCursor"
import AuthModal from "./components/auth/AuthModal"
import SearchModal from "./components/SearchModal"

import CompletionPage from "./pages/CompletionPage"

function WelcomeLayout() {
  return (
    <>
      <Navbar />
      <Welcome />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <CustomCursor />
          <AuthModal />
          <SearchModal />
          <Routes>
            <Route path="/" element={<WelcomeLayout />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/ctf-portal" element={<CTFPortal />} />
            <Route path="/thank-you" element={<CompletionPage />} />
            <Route path="/completion" element={<CompletionPage />} />
          </Routes>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App