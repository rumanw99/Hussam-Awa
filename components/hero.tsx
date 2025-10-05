"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, Send, Download, Star, Sparkles, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

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
    description: "Experienced media professional with 12+ years of expertise in production, marketing, and team leadership in Dubai's dynamic industry.",
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
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden overflow-x-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800"
    >
      {/* Enhanced Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/70 to-blue-800/30 dark:from-gray-900/90 dark:via-blue-900/70 dark:to-gray-800/30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(244, 180, 0, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(244, 180, 0, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(244, 180, 0, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(244, 180, 0, 0.15) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              y: [-10, 10, -10],
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
            <Star className="w-4 h-4 text-yellow-300 opacity-60" />
          </motion.div>
        ))}
      </div>

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10 w-full h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full h-full">
          {/* Content Section */}
          <motion.div
            className="space-y-3 sm:space-y-4 flex flex-col justify-center h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Welcome Badge */}
            <motion.div
              className="inline-flex items-center mt-6 gap-2 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Welcome to my portfolio</span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.span
                className="inline-block text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {heroData.name.split(' ')[0]}
              </motion.span>
              <motion.span
                className="inline-block text-yellow-400 ml-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                {heroData.name.split(' ')[1]}
              </motion.span>
            </motion.h1>

            {/* Animated Title */}
            <motion.div
              className="h-12 sm:h-16 flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <span className="text-lg sm:text-xl md:text-2xl font-light text-white">
                {typedText}
                <motion.span
                  className="inline-block w-0.5 h-6 sm:h-8 ml-1 bg-yellow-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-white/95 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {heroData.description}
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 gap-3 my-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <motion.div
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-xl font-bold text-white">12+</div>
                    <div className="text-xs text-white/80">Years Experience</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-xl font-bold text-white">$5M+</div>
                    <div className="text-xs text-white/80">Revenue Generated</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
            >
              <Button
                size="lg"
                  className="font-bold text-base px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-blue-600 hover:to-blue-700 hover:text-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                  <a href="#contact" className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Contact Me
                </a>
              </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
              >
              <Button
                size="lg"
                variant="outline"
                  className="font-bold text-base px-6 py-3 rounded-xl border-2 border-white text-white hover:bg-white/10 bg-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                  <a href="#about" className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    View Resume
                </a>
              </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex justify-center items-center order-first md:order-none h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Enhanced Glow Effects */}
              <motion.div
                className="absolute -inset-4 rounded-full blur-2xl opacity-30"
                style={{ backgroundColor: "#F4B400" }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full blur-3xl opacity-20"
                style={{
                  background: `radial-gradient(circle, #F4B400 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              <motion.div
                className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
                animate={{
                  y: [-5, 5, -5]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Background Circle */}
                <motion.div
                  className="absolute inset-0 rounded-full transform translate-x-4 translate-y-4"
                  style={{ backgroundColor: "#F4B400" }}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Profile Image */}
                <motion.div
                  className="relative w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                <Image
                  src={heroData.profileImage}
                  alt={heroData.name}
                  width={400}
                  height={400}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                  onLoad={() => setIsLoaded(true)}
                />
                  
                  {/* Overlay Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 360, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Star className="w-4 h-4 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                  animate={{
                    y: [10, -10, 10],
                    rotate: [0, -360, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Award className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.preventDefault()
          const aboutSection = document.getElementById('about')
          if (aboutSection) {
            aboutSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }}
      >
        <motion.div
          className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer"
          animate={{
            y: [-5, 5, -5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.4)"
          }}
          whileTap={{
            scale: 0.9,
            backgroundColor: "rgba(255, 255, 255, 0.3)"
          }}
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.div>
      </motion.a>
    </section>
  )
}
