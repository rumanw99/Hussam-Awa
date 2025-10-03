"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, ChevronUp, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | undefined
  return (...args: any[]) => {
    if (timeoutId) return
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = undefined
    }, delay)
  }
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    // Set loaded after component mounts
    setIsLoaded(true)

    // Throttled scroll handler for performance
    const throttledScroll = throttle(() => {
      setIsScrolled(window.scrollY > 50)
      setShowBackToTop(window.scrollY > 300)

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }, 16) // ~60fps

    // IntersectionObserver for active section detection
    const sections = ["home", "about", "experience", "portfolio", "testimonials", "contact"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    window.addEventListener("scroll", throttledScroll)
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      observer.disconnect()
    }
  }, [])

  // Monitor modal state from body attribute
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsModalOpen(document.body.hasAttribute('data-modal-open'))
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-modal-open']
    })
    
    return () => observer.disconnect()
  }, [])

  const navLinks = [
    { href: "#home", label: "Home", id: "home" },
    { href: "#about", label: "About", id: "about" },
    { href: "#experience", label: "Experience", id: "experience" },
    { href: "#portfolio", label: "Portfolio", id: "portfolio" },
    { href: "#testimonials", label: "Testimonials", id: "testimonials" },
    { href: "#contact", label: "Contact", id: "contact" },
    { href: "/blog", label: "Blog", id: "blog" },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "")
      const element = document.getElementById(targetId)

      if (element) {
        const navHeight = 80
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - navHeight

        // Custom smooth scroll with easing
        const startPosition = window.pageYOffset
        const distance = offsetPosition - startPosition
        const duration = 800 // 0.8 seconds for snappier animation
        let startTime: number | null = null

        const easeInOutCubic = (t: number): number => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }

        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime
          const timeElapsed = currentTime - startTime
          const progress = Math.min(timeElapsed / duration, 1)
          const ease = easeInOutCubic(progress)

          window.scrollTo(0, startPosition + distance * ease)

          if (timeElapsed < duration) {
            requestAnimationFrame(animation)
          }
        }

        requestAnimationFrame(animation)
      }
    } else {
      router.push(href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 h-1 bg-[#F4B400]/20 transition-all duration-300 ${
        isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        <div
          className="h-full bg-[#F4B400] transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-700 ${
          isLoaded && !isModalOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${
          isScrolled
            ? "bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-lg border-b border-[#F4B400]/20 dark:border-yellow-400/20"
            : "bg-gradient-to-b from-[#1A4DA1]/95 to-transparent dark:from-gray-900/95 dark:to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="group relative text-3xl font-bold tracking-tight transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
            >
              <span className={`transition-colors duration-300 ${isScrolled ? "text-[#1A4DA1] dark:text-blue-400" : "text-white dark:text-gray-100"}`}>
                Hussam
              </span>
              <span className="text-[#F4B400] ml-1 relative">
                Awa
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4B400] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(244,180,0,0.6)]"></span>
              </span>
              <div className="absolute inset-0 bg-[#F4B400]/10 rounded-lg scale-0 group-hover:scale-110 transition-transform duration-300 -z-10 blur-sm"></div>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                    activeSection === link.id
                      ? isScrolled
                        ? "text-[#F4B400] dark:text-yellow-400"
                        : "text-[#F4B400] dark:text-yellow-400"
                      : isScrolled
                        ? "text-[#1A4DA1] dark:text-blue-400 hover:text-[#F4B400] dark:hover:text-yellow-400"
                        : "text-white/90 dark:text-gray-200 hover:text-[#F4B400] dark:hover:text-yellow-400"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#F4B400] transition-all duration-500 ${
                      activeSection === link.id ? "w-8 shadow-[0_0_8px_rgba(244,180,0,0.6)]" : "w-0 group-hover:w-8"
                    }`}
                  ></span>
                  <span className="absolute inset-0 bg-[#F4B400]/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                </a>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`ml-4 transition-all duration-300 hover:scale-110 hover:bg-[#F4B400]/20 cursor-pointer ${
                  isScrolled ? "text-[#1A4DA1]" : "text-white"
                }`}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden transition-all duration-300 hover:scale-110 hover:bg-[#F4B400]/20 ${
                isScrolled ? "text-[#1A4DA1]" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-80 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(26, 77, 161, 0.98) 0%, rgba(26, 77, 161, 0.95) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-col items-start justify-center h-full gap-8 px-8 pt-20">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-white text-2xl font-semibold transition-all duration-500 hover:text-[#F4B400] hover:translate-x-2 relative group ${
                isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : "0ms",
              }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4B400] transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_6px_rgba(244,180,0,0.5)]"></span>
            </a>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-white hover:text-[#F4B400] hover:bg-[#F4B400]/20 transition-all duration-300 cursor-pointer"
            style={{
              transitionDelay: isMobileMenuOpen ? `${navLinks.length * 100}ms` : "0ms",
            }}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

    

      
    </>
  )
}
