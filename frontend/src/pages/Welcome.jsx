import Hero from "@/components/Hero"
import AboutCTF from "@/components/AboutCTF"
import Levels from "@/components/Levels"
import FAQ from "@/components/FAQ"
import Footer from "@/components/Footer"

export default function Welcome() {
  return (
    <div>
      <Hero />
      <AboutCTF />
      <Levels />
      <FAQ />
      <Footer />
    </div>
  )
}