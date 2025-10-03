"use client"

import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, Star } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const footer = document.getElementById("footer")
      if (footer) {
        const rect = footer.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    setParticles(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
    })))
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="footer" className="relative text-white py-16 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900">
      {/* Magic Sparkle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-10 left-10 w-4 h-4 text-yellow-300 animate-pulse opacity-70" />
        <Star className="absolute top-20 right-20 w-3 h-3 text-yellow-200 animate-bounce opacity-50" />
        <Star className="absolute bottom-20 left-20 w-5 h-5 text-yellow-400 animate-pulse opacity-60" />
        <Star className="absolute bottom-10 right-10 w-2 h-2 text-yellow-300 animate-ping opacity-80" />
      </div>

      {/* Particle Background */}
      {particles.length > 0 && (
        <div className="particles-container pointer-events-none absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationName: "particle-float",
                animationDuration: "8s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${particle.delay}s`,
                backgroundColor: "rgba(244, 180, 0, 0.4)",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                position: "absolute",
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <a href="#home" className="text-3xl font-bold inline-block mb-3 hover:scale-105 transition-transform duration-300">
              <span className="text-white">Hussam</span>
              <span style={{ color: "#F4B400" }}>Awa</span>
            </a>
            <p className="text-white/80 mb-4">Executive Producer | Marketing & Sales Leader</p>
            <p className="text-white/70 text-sm italic">"Creating magic through media and innovation"</p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#F4B400" }}>Quick Links</h3>
            <div className="flex flex-col gap-2">
              <a href="#home" className="text-white/80 hover:text-yellow-300 transition-colors duration-300">Home</a>
              <a href="#about" className="text-white/80 hover:text-yellow-300 transition-colors duration-300">About</a>
              <a href="#portfolio" className="text-white/80 hover:text-yellow-300 transition-colors duration-300">Portfolio</a>
              <a href="#contact" className="text-white/80 hover:text-yellow-300 transition-colors duration-300">Contact</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#F4B400" }}>Connect With Me</h3>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="#"
                className="text-white/80 hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/hussam-awa-aaa47998/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2025 Hussam Awa. All rights reserved. | Made with <span className="text-red-400">♥</span> and a touch of magic</p>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-yellow-400 text-blue-900 p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-110 animate-bounce cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  )
}
