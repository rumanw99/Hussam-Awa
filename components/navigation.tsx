"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, ChevronUp, Moon, Sun, Sparkles, Star } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

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
      const scrollY = window.scrollY
      const isScrolledNow = scrollY > 50
      setIsScrolled(isScrolledNow)
      setShowBackToTop(scrollY > 300)

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollY / totalHeight) * 100
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
      { 
        threshold: 0.1, 
        rootMargin: "-100px 0px -50% 0px" 
      }
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
    // Enhanced smooth scroll to top with custom easing
    const startPosition = window.pageYOffset
    const duration = Math.min(Math.max(startPosition * 0.5, 300), 1000)
    let startTime: number | null = null

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4)
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easeOutQuart(progress)

      window.scrollTo({
        top: startPosition * (1 - ease),
        behavior: 'auto'
      })

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }

    requestAnimationFrame(animation)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "")
      const element = document.getElementById(targetId)

      if (element) {
        // Enhanced smooth scroll with better performance
        const navHeight = 80
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - navHeight

        // Improved smooth scroll with multiple easing options
        const startPosition = window.pageYOffset
        const distance = offsetPosition - startPosition
        const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 300), 1200) // Dynamic duration based on distance
        let startTime: number | null = null

        // Enhanced easing functions
        const easingFunctions = {
          easeInOutCubic: (t: number): number => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          },
          easeOutQuart: (t: number): number => {
            return 1 - Math.pow(1 - t, 4)
          },
          easeInOutQuart: (t: number): number => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
          }
        }

        // Use the most appropriate easing function based on distance
        const easingFunction = Math.abs(distance) > 1000 ? 
          easingFunctions.easeInOutQuart : 
          easingFunctions.easeOutQuart

        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime
          const timeElapsed = currentTime - startTime
          const progress = Math.min(timeElapsed / duration, 1)
          const ease = easingFunction(progress)

          // Smooth scroll with better performance
          window.scrollTo({
            top: startPosition + distance * ease,
            behavior: 'auto' // Use 'auto' for better control
          })

          if (timeElapsed < duration) {
            requestAnimationFrame(animation)
          } else {
            // Ensure we end exactly at the target position
            window.scrollTo({
              top: offsetPosition,
              behavior: 'auto'
            })
          }
        }

        // Add visual feedback during scroll
        const scrollIndicator = document.createElement('div')
        scrollIndicator.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #1A4DA1 0%, #3B82F6 25%, #60A5FA 50%, #F4B400 75%, #F59E0B 100%);
          box-shadow: 0 0 20px rgba(244, 180, 0, 0.4), 0 0 40px rgba(26, 77, 161, 0.3);
          z-index: 9999;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `
        document.body.appendChild(scrollIndicator)

        // Start the scroll animation
        requestAnimationFrame(animation)

        // Animate the scroll indicator
        setTimeout(() => {
          scrollIndicator.style.transform = 'scaleX(1)'
        }, 10)

        // Clean up the indicator
        setTimeout(() => {
          scrollIndicator.style.transform = 'scaleX(0)'
          setTimeout(() => {
            if (scrollIndicator.parentNode) {
              scrollIndicator.parentNode.removeChild(scrollIndicator)
            }
          }, 300)
        }, duration * 0.8)
      }
    } else {
      router.push(href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Enhanced Scroll Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 h-1.5 transition-all duration-300 ${
          isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full bg-gradient-to-r from-blue-600/10 via-blue-700/15 to-yellow-400/10 backdrop-blur-sm" />
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-400 shadow-lg shadow-blue-500/25"
          style={{
            background: "linear-gradient(90deg, #1A4DA1 0%, #3B82F6 25%, #60A5FA 50%, #F4B400 75%, #F59E0B 100%)",
            boxShadow: "0 0 20px rgba(244, 180, 0, 0.3), 0 0 40px rgba(26, 77, 161, 0.2)"
          }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-yellow-400 to-yellow-300 shadow-lg shadow-yellow-400/50"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: scrollProgress > 0 ? 1 : 0,
            scaleY: scrollProgress > 0 ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>

      <motion.nav
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-700 ${
          isLoaded && !isModalOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${
          isScrolled
            ? "bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-lg border-b border-yellow-400/20 dark:border-yellow-400/20"
            : "bg-gradient-to-b from-blue-600/95 to-transparent dark:from-gray-900/95 dark:to-transparent backdrop-blur-sm"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="group relative text-3xl font-bold tracking-tight transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className={`transition-colors duration-300 ${isScrolled ? "text-blue-600 dark:text-blue-400" : "text-white dark:text-gray-100"}`}
                whileHover={{ color: "#F4B400" }}
                transition={{ duration: 0.3 }}
              >
                Hussam
              </motion.span>
              <motion.span
                className="text-yellow-400 ml-1 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                Awa
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-yellow-400 shadow-[0_0_8px_rgba(244,180,0,0.6)]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-yellow-400/10 rounded-lg -z-10 blur-sm"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    // Add click animation feedback
                    const element = e.currentTarget
                    element.style.transform = 'scale(0.95)'
                    setTimeout(() => {
                      element.style.transform = 'scale(1)'
                    }, 150)
                    
                    handleNavClick(e, link.href)
                  }}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                    activeSection === link.id
                      ? "text-yellow-400 dark:text-yellow-400"
                      : isScrolled
                        ? "text-blue-600 dark:text-blue-400 hover:text-yellow-400 dark:hover:text-yellow-400"
                        : "text-white/90 dark:text-gray-200 hover:text-yellow-400 dark:hover:text-yellow-400"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                  <motion.span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-yellow-400 shadow-[0_0_8px_rgba(244,180,0,0.6)]`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: activeSection === link.id ? 32 : 0 
                    }}
                    whileHover={{ width: 32 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="absolute inset-0 bg-yellow-400/10 rounded-lg -z-10"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`ml-4 transition-all duration-300 hover:scale-110 hover:bg-yellow-400/20 cursor-pointer ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden transition-all duration-300 hover:scale-110 hover:bg-yellow-400/20 ${
                  isScrolled ? "text-blue-600" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <motion.div
        className={`fixed top-0 right-0 h-full w-80 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(26, 77, 161, 0.98) 0%, rgba(26, 77, 161, 0.95) 100%)",
          backdropFilter: "blur(10px)",
        }}
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Floating Stars in Mobile Menu */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                top: `${15 + i * 20}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            >
              <Star className="w-3 h-3 text-yellow-300 opacity-60" />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-center h-full gap-8 px-8 pt-20 relative z-10">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                // Add click animation feedback for mobile
                const element = e.currentTarget
                element.style.transform = 'scale(0.95) translateX(5px)'
                setTimeout(() => {
                  element.style.transform = 'scale(1) translateX(0px)'
                }, 150)
                
                handleNavClick(e, link.href)
              }}
              className="text-white text-2xl font-semibold transition-all duration-500 hover:text-yellow-400 hover:translate-x-2 relative group"
              initial={{ x: 20, opacity: 0 }}
              animate={{ 
                x: isMobileMenuOpen ? 0 : 20, 
                opacity: isMobileMenuOpen ? 1 : 0 
              }}
              transition={{ 
                duration: 0.5, 
                delay: isMobileMenuOpen ? index * 0.1 : 0 
              }}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(244,180,0,0.5)]"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ 
              x: isMobileMenuOpen ? 0 : 20, 
              opacity: isMobileMenuOpen ? 1 : 0 
            }}
            transition={{ 
              duration: 0.5, 
              delay: isMobileMenuOpen ? navLinks.length * 0.1 : 0 
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:text-yellow-400 hover:bg-yellow-400/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}