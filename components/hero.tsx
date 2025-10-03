"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, Send, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  const [typedText, setTypedText] = useState("")
  const [titleIndex, setTitleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([])
  const sectionRef = useRef<HTMLElement>(null)
  const [heroData, setHeroData] = useState({
    name: "Hussam Awa",
    titles: ["Executive Producer", "HR Manager", "Sales Manager", "Marketing Manager"],
    description: "Golden Visa holder with 12+ years of experience in media production, marketing, and team leadership in Dubai's dynamic industry.",
    profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg"
  })

  const titles = heroData.titles

  useEffect(() => {
    const currentTitle = titles[titleIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typedText.length < currentTitle.length) {
            setTypedText(currentTitle.substring(0, typedText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (typedText.length > 0) {
            setTypedText(currentTitle.substring(0, typedText.length - 1))
          } else {
            setIsDeleting(false)
            setTitleIndex((titleIndex + 1) % titles.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, titleIndex])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
      return () => section.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    
    // Generate particles only on client side
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
    })))
    
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/hero')
        if (response.ok) {
          const data = await response.json()
          setHeroData(data)
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error)
      }
    }
    
    fetchHeroData()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative pt-16 sm:pt-20 overflow-hidden overflow-x-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-white dark:from-gray-900 dark:via-blue-900 dark:to-gray-800"
    >
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/70 to-white/30 dark:from-gray-900/90 dark:via-blue-900/70 dark:to-gray-800/30"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(244, 180, 0, 0.1) 0%, transparent 50%), linear-gradient(135deg, var(--color-royal-blue) 0%, var(--color-royal-blue-light) 50%, var(--color-background) 100%)`,
      }}
    />

      {/* Particle Background */}
      {particles.length > 0 && (
        <div className="particles-container">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          {/* Content Section */}
          <div className={`space-y-4 sm:space-y-6 ${isLoaded ? 'magic-fade-in-left' : 'opacity-0'}`}>
            <h1
              className={`text-4xl sm:text-5xl md:text-7xl font-bold leading-tight ${isLoaded ? 'magic-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <span
                className="magic-shimmer"
                style={{
                  background: 'linear-gradient(45deg, #F4B400, #F7C84A, #F4B400)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {heroData.name}
              </span>
            </h1>

            <div
              className={`h-12 sm:h-16 flex items-center ${isLoaded ? 'magic-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-light text-white dark:text-gray-100">
                {typedText}
                <span
                  className="inline-block w-0.5 h-6 sm:h-8 ml-1 magic-glow"
                  style={{ backgroundColor: "#F4B400" }}
                />
              </span>
            </div>

            <p
              className={`text-base sm:text-lg md:text-xl text-white/95 dark:text-gray-200 max-w-lg leading-relaxed ${isLoaded ? 'magic-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}
            >
              {heroData.description}
            </p>

            <div
              className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4 ${isLoaded ? 'magic-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}
            >
              <Button
                size="lg"
                className="font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group w-full sm:w-auto"
                style={{
                  backgroundColor: "#F4B400",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A4DA1"
                  e.currentTarget.style.color = "#F4B400"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F4B400"
                  e.currentTarget.style.color = "#FFFFFF"
                }}
                asChild
              >
                <a href="#contact" className="relative z-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <span className="relative">Contact Me</span> <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 bg-transparent hover:scale-105 transition-all duration-300 relative overflow-hidden group w-full sm:w-auto"
                asChild
              >
                <a href="#about" className="relative z-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <span className="relative">View Resume</span> <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image Section */}
          <div
            className={`flex justify-center order-first md:order-none ${isLoaded ? 'magic-fade-in-right' : 'opacity-0'}`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative group">
              <div
                className="absolute -inset-4 rounded-full blur-2xl opacity-20 magic-glow"
                style={{ backgroundColor: "#F4B400" }}
              />
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-10"
                style={{
                  background: `radial-gradient(circle, #F4B400 0%, transparent 70%)`,
                  transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                }}
              />
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 magic-float">
                <div
                  className="absolute inset-0 rounded-full transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                  style={{ backgroundColor: "#F4B400" }}
                />
                <Image
                  src={heroData.profileImage}
                  alt={heroData.name}
                  width={400}
                  height={400}
                  className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                  onLoad={() => setIsLoaded(true)}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hover:scale-110 transition-transform duration-300 z-20"
      >
        <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </a>
    </section>
  )
}
