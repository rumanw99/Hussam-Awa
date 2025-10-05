"use client"

import { Facebook, Twitter, Linkedin, Instagram, ArrowUp, Star, Mail, Phone, MapPin, Globe, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

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
    <footer id="footer" className="relative text-white py-20 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
      {/* Enhanced Magic Sparkle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-4 h-4 text-yellow-300" />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20"
          animate={{ 
            y: [-5, 5, -5],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-3 h-3 text-yellow-200" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-5 h-5 text-yellow-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-2 h-2 text-yellow-300" />
        </motion.div>
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
        {/* Contact Info Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Mail className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            </motion.div>
            <h4 className="text-lg font-bold mb-2 text-yellow-400">Email</h4>
            <p className="text-white/80 text-sm">hussam.awa@icloud.com</p>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Phone className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            </motion.div>
            <h4 className="text-lg font-bold mb-2 text-yellow-400">Phone</h4>
            <p className="text-white/80 text-sm">+971 50 1883240</p>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MapPin className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            </motion.div>
            <h4 className="text-lg font-bold mb-2 text-yellow-400">Location</h4>
            <p className="text-white/80 text-sm">Dubai Sports City, UAE</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="#home"
              className="text-4xl font-bold inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white">Hussam</span>
              <span className="text-yellow-400">Awa</span>
            </motion.a>
            <motion.p
              className="text-white/80 mb-4 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Executive Producer | Marketing & Sales Leader
            </motion.p>
            <motion.p
              className="text-white/70 text-sm italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              "Creating magic through media and innovation"
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {['Home', 'About', 'Portfolio', 'Contact'].map((link, index) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-white/80 hover:text-yellow-300 transition-colors duration-300 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5, color: "#F4B400" }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Connect With Me</h3>
            <div className="flex justify-center md:justify-end gap-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/hussam-awa-aaa47998/", label: "LinkedIn" },
                { icon: Instagram, href: "#", label: "Instagram" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? "_blank" : undefined}
                  rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="text-white/80 hover:text-yellow-300 transition-all duration-300 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    backgroundColor: "rgba(244, 180, 0, 0.2)"
                  }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-white/20 mt-8 pt-8 text-center text-white/60"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            viewport={{ once: true }}
          >
            &copy; 2025 Hussam Awa. All rights reserved. | Made with{' '}
            <motion.span
              className="text-yellow-400 inline-block"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ♥
            </motion.span>
            {' '}and a touch of magic
          </motion.p>
        </motion.div>
      </div>

     
    </footer>
  )
}
