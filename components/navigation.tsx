"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Menu, X, ChevronUp, Moon, Sun, Sparkles, Star } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"

// Enhanced throttling with requestAnimationFrame for better performance
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | undefined
  let lastExecTime = 0
  
  return (...args: any[]) => {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
      timeoutId = undefined
      }, delay - (currentTime - lastExecTime))
    }
  }
}

// Debounce function for better performance
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | undefined
  
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const shouldReduceMotion = useReducedMotion()
  
  // Debug function to check sections
  const debugSections = () => {
    console.log('=== DEBUGGING SECTIONS ===')
    const sections = ["home", "about", "experience", "portfolio", "testimonials", "contact"]
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        const elementBottom = elementTop + rect.height
        const isInView = rect.top <= 100 && rect.bottom >= 100
        const distanceFromCenter = Math.abs((scrollY + viewportHeight / 2) - (elementTop + rect.height / 2))
        
        console.log(`Section ${id}:`, {
          exists: true,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          isInView,
          distanceFromCenter,
          scrollY,
          viewportHeight
        })
      } else {
        console.log(`Section ${id}: NOT FOUND`)
      }
    })
    console.log('Current active section:', activeSection)
    console.log('Manual navigation flag:', isManualNavigation)
    console.log('=== END DEBUG ===')
  }
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shouldShowParticles, setShouldShowParticles] = useState(false)
  const [isManualNavigation, setIsManualNavigation] = useState(false)
  const [lastSectionUpdate, setLastSectionUpdate] = useState(0)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  // Performance-optimized animation variants
  const fadeInUp = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" as const }
  }

  const scaleIn = {
    initial: shouldReduceMotion ? { scale: 1 } : { scale: 0 },
    animate: { scale: 1 },
    transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }
  }

  const slideIn = {
    initial: shouldReduceMotion ? { x: 0 } : { x: 20 },
    animate: { x: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }
  }

  // Memoized navigation links for better performance
  const navLinks = useMemo(() => [
    { href: "#home", label: "Home", id: "home" },
    { href: "#about", label: "About", id: "about" },
    { href: "#experience", label: "Experience", id: "experience" },
    { href: "#portfolio", label: "Portfolio", id: "portfolio" },
    { href: "#testimonials", label: "Testimonials", id: "testimonials" },
    { href: "#contact", label: "Contact", id: "contact" },
    { href: "/blog", label: "Blog", id: "blog" },
  ], [])

  // Memoized scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const isScrolledNow = scrollY > 50
    setIsScrolled(isScrolledNow)
    setShowBackToTop(scrollY > 300)

    // Calculate scroll progress with better performance
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0
    setScrollProgress(progress)

    // Enhanced fallback section detection with better stability
    if (!isManualNavigation) {
      const sections = ["home", "about", "experience", "portfolio", "testimonials", "contact"]
      const navHeight = 80
      const viewportHeight = window.innerHeight
      const viewportCenter = scrollY + viewportHeight / 2

      let activeSectionId = "home"
      let bestSection = { id: "home", visibility: 0, distance: Infinity }

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollY
          const elementBottom = elementTop + rect.height
          const elementCenter = elementTop + rect.height / 2
          
          // Calculate visibility percentage
          const visibleTop = Math.max(elementTop, scrollY)
          const visibleBottom = Math.min(elementBottom, scrollY + viewportHeight)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          const visibility = visibleHeight / rect.height
          
          // Calculate distance from viewport center
          const distance = Math.abs(viewportCenter - elementCenter)
          
          // Only consider sections that are at least 20% visible
          if (visibility >= 0.2) {
            // Prefer sections with higher visibility, then closer distance
            if (visibility > bestSection.visibility || 
                (visibility === bestSection.visibility && distance < bestSection.distance)) {
              bestSection = { id: sectionId, visibility, distance }
            }
          }
        }
      })

      // Only update if we have a significantly better section with debouncing
      const now = Date.now()
      if (bestSection.visibility >= 0.3 && 
          bestSection.id !== activeSection && 
          now - lastSectionUpdate > 200) { // 200ms debounce
        console.log(`Fallback section detection: ${bestSection.id} (visibility: ${bestSection.visibility.toFixed(2)})`)
        setActiveSection(bestSection.id)
        setLastSectionUpdate(now)
      }
    }
  }, [activeSection, isManualNavigation])

  // Memoized navigation click handler
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "")
      const element = document.getElementById(targetId)

      if (element) {
        // Set manual navigation flag
        setIsManualNavigation(true)
        
        // Immediately update active section and force re-render
        setActiveSection(targetId)
        
        // Enhanced smooth scroll with better performance
        const navHeight = 80
        const elementRect = element.getBoundingClientRect()
        const elementPosition = elementRect.top + window.pageYOffset
        const offsetPosition = Math.max(0, elementPosition - navHeight)

        // Enhanced smooth scroll with better performance and smoother animation
        const startPosition = window.pageYOffset
        const distance = offsetPosition - startPosition
        const duration = Math.min(Math.max(Math.abs(distance) * 0.8, 500), 1500) // Longer duration for smoother scroll
        let startTime: number | null = null

        // Ultra-smooth easing function
        const easeInOutCubic = (t: number): number => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }

        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime
          const timeElapsed = currentTime - startTime
          const progress = Math.min(timeElapsed / duration, 1)
          const ease = easeInOutCubic(progress)

          // Calculate smooth scroll position
          const currentScrollPosition = startPosition + distance * ease
          
          // Use smooth scrollTo
          window.scrollTo({
            top: Math.round(currentScrollPosition),
            left: 0,
            behavior: 'auto'
          })

          if (timeElapsed < duration) {
            requestAnimationFrame(animation)
          } else {
            // Final position with smooth ending
            window.scrollTo({
              top: Math.round(offsetPosition),
              left: 0,
              behavior: 'auto'
            })
            // Ensure active section is set after scroll completes
            setActiveSection(targetId)
            
            // Reset manual navigation flag after scroll completes
            setTimeout(() => {
              setIsManualNavigation(false)
              setLastSectionUpdate(Date.now()) // Reset debounce timer
            }, 100)
          }
        }

        // Start smooth animation
        requestAnimationFrame(animation)
        
        // Close mobile menu if open
        setIsMobileMenuOpen(false)
        
        // Reset manual navigation flag after a delay
        setTimeout(() => {
          setIsManualNavigation(false)
          setLastSectionUpdate(Date.now()) // Reset debounce timer
        }, 200)
      }
    } else {
      router.push(href)
      // Close mobile menu if open
      setIsMobileMenuOpen(false)
    }
  }, [router])

  useEffect(() => {
    // Set loaded after component mounts
    setIsLoaded(true)

    // Enhanced scroll handler with better performance
    const throttledScroll = throttle(handleScroll, 16) // ~60fps

    // Enhanced section detection using IntersectionObserver for better performance
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // More sensitive detection
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // More granular thresholds
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      // Skip updates during manual navigation
      if (isManualNavigation) return
      
      let mostVisible = { id: "home", ratio: 0, area: 0 }
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect
          const area = rect.width * rect.height
          
          // Prefer sections with higher intersection ratio and larger visible area
          if (entry.intersectionRatio > mostVisible.ratio || 
              (entry.intersectionRatio === mostVisible.ratio && area > mostVisible.area)) {
            mostVisible = { 
              id: entry.target.id, 
              ratio: entry.intersectionRatio,
              area: area
            }
          }
        }
      })
      
      // Only update if we have a significantly visible section with debouncing
      const now = Date.now()
      if (mostVisible.id && 
          mostVisible.id !== activeSection && 
          mostVisible.ratio > 0.3 && 
          now - lastSectionUpdate > 200) { // 200ms debounce
        console.log(`Section changed to: ${mostVisible.id} (ratio: ${mostVisible.ratio.toFixed(2)}, area: ${mostVisible.area.toFixed(0)})`)
        setActiveSection(mostVisible.id)
        setLastSectionUpdate(now)
      }
    }, observerOptions)

    // Function to observe sections with better error handling
    const observeSections = () => {
      const sections = ["home", "about", "experience", "portfolio", "testimonials", "contact"]
    sections.forEach((id) => {
      const element = document.getElementById(id)
        if (element) {
          console.log(`Observing section: ${id}`)
          sectionObserver.observe(element)
        } else {
          console.warn(`Section not found: ${id}`)
        }
      })
    }

    // Cleanup function for better performance
    const cleanup = () => {
      sectionObserver.disconnect()
      window.removeEventListener('scroll', throttledScroll)
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', throttledScroll, { passive: true })

    // Observe sections when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeSections)
    } else {
      observeSections()
    }

    // Initial check with delay to ensure DOM is ready
    setTimeout(() => {
      throttledScroll()
    }, 100)

    // Lazy load particles after a delay for better performance
    const particlesTimer = setTimeout(() => {
      setShouldShowParticles(true)
    }, 1000)

    // Cleanup on unmount
    return () => {
      cleanup()
      clearTimeout(particlesTimer)
    }
  }, [handleScroll])
    
  // Add debug button to window for testing
  if (typeof window !== 'undefined') {
    (window as any).debugSections = debugSections
  }

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

  const scrollToTop = () => {
    // Enhanced ultra-smooth scroll to top with better performance
    const startPosition = window.pageYOffset
    const duration = Math.min(Math.max(startPosition * 1.2, 800), 2000) // Much longer duration for ultra-smooth scroll
    let startTime: number | null = null

    // Ultra-smooth easing function with better curve
    const easeInOutQuart = (t: number): number => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easeInOutQuart(progress)

      // Ultra-smooth scroll calculation with better precision
      const currentScrollPosition = startPosition * (1 - ease)

      // Use smooth scrollTo with better performance
      window.scrollTo({
        top: Math.round(currentScrollPosition),
        left: 0,
        behavior: 'auto'
      })

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      } else {
        // Final ultra-smooth position
        window.scrollTo({ 
          top: 0, 
          left: 0,
          behavior: 'auto' 
        })
        
        // Update active section to home after scroll completes
        setActiveSection('home')
      }
    }

    // Start ultra-smooth animation
    requestAnimationFrame(animation)
  }

  return (
    <>
      {/* Enhanced Scroll Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 h-1.5 transition-all duration-500 ${
          isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        {...fadeInUp}
        whileHover={{
          height: 6,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        <div className="h-full backdrop-blur-sm scroll-progress-background" />
        <motion.div
          className="h-full shadow-lg scroll-progress-bar relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Animated shine effect on progress bar */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 h-full w-1 shadow-lg scroll-progress-indicator"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: scrollProgress > 0 ? 1 : 0,
            scaleY: scrollProgress > 0 ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{
            scaleY: 1.5,
            transition: { duration: 0.2 }
          }}
        />
        
        {/* Floating particles on progress bar */}
        {scrollProgress > 0 && [...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${scrollProgress * 0.8 + i * 5}%`,
              top: "-2px"
            }}
            animate={{
              y: [-2, 2, -2],
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      <motion.nav
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-700 ${
          isLoaded && !isModalOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${
          isScrolled
            ? "bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-lg border-b border-yellow-400/20 dark:border-yellow-400/20"
            : "bg-gradient-to-b from-blue-600/95 to-transparent dark:from-gray-900/95 dark:to-transparent backdrop-blur-sm"
        }`}
        initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.a
              data-href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="group relative text-3xl font-bold tracking-tight transition-all duration-500 hover:drop-shadow-2xl cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <motion.span
                className={`transition-colors duration-500 ${isScrolled ? "text-blue-600 dark:text-blue-400" : "text-white dark:text-gray-100"}`}
                transition={{ duration: 0.5 }}
                whileHover={{
                  textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                  transition: { duration: 0.3 }
                }}
              >
                Hussam
              </motion.span>
              <motion.span
                className="text-yellow-400 ml-1 relative"
                transition={{ duration: 0.5 }}
                whileHover={{
                  textShadow: "0 0 20px rgba(244, 180, 0, 0.8)",
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                Awa
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 shadow-[0_0_8px_rgba(244,180,0,0.6)]"
                  style={{
                    background: "linear-gradient(90deg, #f4b400 0%, #f59e0b 100%)",
                    boxShadow: "0 0 8px rgba(244, 180, 0, 0.6), 0 0 16px rgba(244, 180, 0, 0.4)"
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </motion.span>
              
              {/* Enhanced glow effects */}
              <motion.div
                className="absolute inset-0 rounded-lg -z-10 blur-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(244, 180, 0, 0.1) 0%, rgba(247, 200, 74, 0.15) 50%, rgba(245, 158, 11, 0.1) 100%)",
                  boxShadow: "0 0 20px rgba(244, 180, 0, 0.3)"
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{
                  scale: 1.1,
                  opacity: 0.8,
                  boxShadow: "0 0 30px rgba(244, 180, 0, 0.5)",
                  transition: { duration: 0.3 }
                }}
              />
              
              {/* Floating particles around logo - lazy loaded */}
              {shouldShowParticles && [...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${-5 + i * 10}%`,
                  }}
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  />
              ))}
            </motion.a>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  data-href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href)
                  }}
                  className={`relative px-4 py-2 font-medium transition-all duration-500 rounded-lg group cursor-pointer overflow-hidden ${
                    activeSection === link.id
                      ? "text-yellow-400 dark:text-yellow-400"
                      : isScrolled
                        ? "text-blue-600 dark:text-blue-400 hover:text-yellow-400 dark:hover:text-yellow-400"
                        : "text-white/90 dark:text-gray-200 hover:text-yellow-400 dark:hover:text-yellow-400"
                  }`}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                >
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: 1,
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                    animate={{
                      background: [
                        "linear-gradient(45deg, rgba(244, 180, 0, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(244, 180, 0, 0.1) 100%)",
                        "linear-gradient(45deg, rgba(244, 180, 0, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                  />
                  
                  <span className="relative z-10">{link.label}</span>
                  
                  {/* Enhanced active indicator */}
                  <motion.span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full shadow-[0_0_12px_rgba(244,180,0,0.8)]`}
                    style={{
                      background: "linear-gradient(90deg, #f4b400 0%, #f59e0b 50%, #f4b400 100%)",
                      boxShadow: "0 0 12px rgba(244, 180, 0, 0.8), 0 0 24px rgba(244, 180, 0, 0.6), 0 0 36px rgba(244, 180, 0, 0.4)"
                    }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ 
                      width: activeSection === link.id ? "100%" : "0%",
                      opacity: activeSection === link.id ? 1 : 0,
                      scaleY: activeSection === link.id ? 1 : 0.5
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{
                      width: "100%",
                      opacity: 1,
                      scaleY: 1.2,
                      transition: { duration: 0.3 }
                    }}
                  />
                  
                  {/* Active section glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(244, 180, 0, 0.15) 0%, rgba(247, 200, 74, 0.2) 50%, rgba(245, 158, 11, 0.15) 100%)",
                      boxShadow: "inset 0 0 20px rgba(244, 180, 0, 0.3)"
                    }}
                    animate={{
                      opacity: activeSection === link.id ? 1 : 0,
                      scale: activeSection === link.id ? 1 : 0.8
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  
                  {/* Pulsing dot indicator */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0"
                    animate={{
                      opacity: activeSection === link.id ? 1 : 0,
                      scale: activeSection === link.id ? [1, 1.2, 1] : 0
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: activeSection === link.id ? Infinity : 0,
                      repeatDelay: 1.5
                    }}
                  />
                  
                  {/* Floating particles on hover - lazy loaded */}
                  {shouldShowParticles && [...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        left: `${30 + i * 40}%`,
                        top: `${-2 + i * 4}%`,
                      }}
                      animate={{
                        y: [-3, 3, -3],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`ml-4 transition-all duration-300 cursor-pointer ${
                      isScrolled ? "text-blue-600 hover:bg-yellow-400/20" : "text-white hover:bg-yellow-400/20"
                  }`}
                    style={{
                      background: "linear-gradient(135deg, rgba(244, 180, 0, 0.1) 0%, rgba(247, 200, 74, 0.15) 50%, rgba(245, 158, 11, 0.1) 100%)"
                    }}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.div
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                    className={`md:hidden transition-all duration-500 hover:bg-yellow-400/20 rounded-full ${
                  isScrolled ? "text-blue-600" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                      animate={{ 
                        rotate: isMobileMenuOpen ? 90 : 0,
                        scale: isMobileMenuOpen ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <motion.div
        className={`fixed top-0 right-0 h-full w-80 z-40 md:hidden transition-all duration-700 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(26, 77, 161, 0.98) 0%, rgba(37, 99, 184, 0.95) 50%, rgba(26, 77, 161, 0.95) 100%)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 0 40px rgba(26, 77, 161, 0.4), 0 0 80px rgba(37, 99, 184, 0.3), inset 0 0 20px rgba(244, 180, 0, 0.1)"
        }}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ 
          x: isMobileMenuOpen ? 0 : "100%",
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ 
          duration: 0.7, 
          ease: "easeInOut",
          type: "spring",
          stiffness: 100
        }}
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
              <Star className="w-3 h-3 opacity-60" style={{ color: '#f4b400' }} />
            </motion.div>
          ))}
        </div>

        {/* Enhanced mobile menu header */}
        <motion.div
          className="absolute top-6 left-6 right-6 flex items-center justify-between z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0,
            y: isMobileMenuOpen ? 0 : -20
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h3
            className="text-white text-lg font-bold"
            style={{
              textShadow: "0 0 10px rgba(244, 180, 0, 0.5)"
            }}
          >
            Navigation
          </motion.h3>
          <motion.div
            className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center"
            animate={{
              rotate: isMobileMenuOpen ? 360 : 0,
              scale: isMobileMenuOpen ? 1 : 0.8
            }}
            transition={{ duration: 0.5 }}
          >
            <Star className="w-4 h-4 text-yellow-400" />
          </motion.div>
        </motion.div>

        <div className="flex flex-col items-start justify-center h-full gap-8 px-8 pt-20 relative z-10">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              data-href={link.href}
              onClick={(e) => {
                handleNavClick(e, link.href)
              }}
              className={`text-2xl font-semibold transition-all duration-500 hover:translate-x-2 relative group cursor-pointer overflow-hidden ${
                activeSection === link.id 
                  ? "text-yellow-400" 
                  : "text-white hover:text-yellow-400"
              }`}
              style={{
                textShadow: activeSection === link.id 
                  ? "0 0 15px rgba(244, 180, 0, 0.6)" 
                  : "0 0 10px rgba(244, 180, 0, 0.3)"
              }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ 
                x: isMobileMenuOpen ? 0 : 20, 
                opacity: isMobileMenuOpen ? 1 : 0 
              }}
              transition={{ 
                duration: 0.5, 
                delay: isMobileMenuOpen ? index * 0.1 : 0 
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              {/* Animated background for mobile links */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
              />
              
              {/* Shine effect for mobile links */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              />
              
              <span className="relative z-10">{link.label}</span>
              
              {/* Enhanced mobile active indicator */}
              <motion.span
                className="absolute -bottom-1 left-0 h-1 rounded-full shadow-[0_0_8px_rgba(244,180,0,0.7)]"
                style={{
                  background: "linear-gradient(90deg, #f4b400 0%, #f59e0b 50%, #f4b400 100%)",
                  boxShadow: "0 0 8px rgba(244, 180, 0, 0.7), 0 0 16px rgba(244, 180, 0, 0.5), 0 0 24px rgba(244, 180, 0, 0.3)"
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: activeSection === link.id ? "100%" : "0%",
                  opacity: activeSection === link.id ? 1 : 0
                }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                whileHover={{
                  width: "100%",
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
              />
              
              {/* Active section indicator dot */}
              <motion.div
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full opacity-0"
                animate={{
                  opacity: activeSection === link.id ? 1 : 0,
                  scale: activeSection === link.id ? [1, 1.3, 1] : 0
                }}
                transition={{
                  duration: 0.3,
                  repeat: activeSection === link.id ? Infinity : 0,
                  repeatDelay: 1.2
                }}
              />
              
              {/* Floating particles for mobile links - lazy loaded */}
              {shouldShowParticles && [...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    left: `${20 + i * 60}%`,
                    top: `${-1 + i * 2}%`,
                  }}
                  animate={{
                    y: [-2, 2, -2],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.2 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1
                  }}
                />
              ))}
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
            <motion.div
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:text-yellow-400 transition-all duration-300 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(244, 180, 0, 0.1) 0%, rgba(247, 200, 74, 0.15) 50%, rgba(245, 158, 11, 0.1) 100%)"
                }}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Back to Top Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.button
          onClick={scrollToTop}
          className="group relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-2xl shadow-yellow-500/50 border-2 border-yellow-300/50 flex items-center justify-center cursor-pointer overflow-hidden"
          whileHover={{
            scale: 1.15,
            boxShadow: "0 0 40px rgba(244, 180, 0, 0.8)",
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          whileTap={{
            scale: 0.9,
            transition: { duration: 0.2, ease: "easeInOut" }
          }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(244, 180, 0, 0.4)",
              "0 0 35px rgba(244, 180, 0, 0.7)",
              "0 0 20px rgba(244, 180, 0, 0.4)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-yellow-400/20 rounded-full"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            animate={{
              y: [-3, 3, -3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronUp className="w-6 h-6 text-blue-900 font-bold" />
          </motion.div>
          
          {/* Floating particles around button - lazy loaded */}
          {shouldShowParticles && [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${50 + Math.cos(i * 90 * Math.PI / 180) * 30}%`,
                top: `${50 + Math.sin(i * 90 * Math.PI / 180) * 30}%`,
              }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.8, 0],
                y: [-5, 5, -5]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4
              }}
            />
          ))}
        </motion.button>
      </motion.div>
    </>
  )
}