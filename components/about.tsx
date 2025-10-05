"use client"

import { Award, DollarSign, Users, Briefcase, Star, TrendingUp, Target, Zap } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [aboutData, setAboutData] = useState({
    title: 'Media Industry Expert',
    profileImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg',
    content: 'Experienced professional with a proven track record in media production, marketing, and team leadership. Media industry expert with extensive experience in Dubai\'s dynamic business environment. I specialize in creating compelling visual content and leading high-performing teams to deliver exceptional results.',
    stats: [
      { icon: "Briefcase", value: "12+", label: "Years Experience" },
      { icon: "DollarSign", value: "$5M+", label: "Revenue Generated" },
      { icon: "Users", value: "20+", label: "Team Members Led" },
      { icon: "Award", value: "100+", label: "Projects Completed" },
    ]
  })
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        console.log('Fetching about data...')
        const response = await fetch('/api/about')
        console.log('About API response:', response.status)
        if (response.ok) {
          const data = await response.json()
          console.log('About data received:', data)
          console.log('About data content:', data.content)
          console.log('About data profileImage:', data.profileImage)
          console.log('About data title:', data.title)
          
          // Merge with default data to ensure we have fallbacks
          const mergedData = {
            title: data.title || 'Media Industry Expert',
            profileImage: data.profileImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg',
            content: data.content || 'Experienced professional with a proven track record in media production, marketing, and team leadership. Media industry expert with extensive experience in Dubai\'s dynamic business environment.',
            stats: data.stats || [
              { icon: "Briefcase", value: "12+", label: "Years Experience" },
              { icon: "DollarSign", value: "$5M+", label: "Revenue Generated" },
              { icon: "Users", value: "20+", label: "Team Members Led" },
              { icon: "Award", value: "100+", label: "Projects Completed" }
            ]
          }
          
          console.log('About merged data:', mergedData)
          setAboutData(mergedData)
        } else {
          console.error('About API error:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  const getIcon = (iconName: string) => {
    const icons: any = {
      Briefcase,
      DollarSign,
      Users,
      Award
    }
    return icons[iconName] || Briefcase
  }

  return (
    <section
      ref={ref}
      id="about"
      className="py-24 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2>
        <motion.div
          className="w-16 h-1 mb-12 bg-yellow-400"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        />

        <div className="grid md:grid-cols-3 gap-12 items-start">
          <motion.div
            className="md:col-span-1 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-4 rounded-full border-4 border-yellow-400"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              />
              <motion.div
                className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2
                }}
                transition={{ duration: 0.3 }}
              >
                {aboutData.profileImage ? (
                  <Image
                    src={aboutData.profileImage}
                    alt="Hussam Awa"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">HA</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="p-8 rounded-2xl bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 shadow-lg"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(26, 77, 161, 0.15)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                />
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {aboutData.title}
                </h3>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    <p className="text-gray-400">Loading...</p>
                  </div>
                ) : aboutData.content ? (
                  <p className="whitespace-pre-wrap text-lg leading-relaxed">{aboutData.content}</p>
                ) : (
                  <p className="text-gray-500 italic">No content available</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {aboutData.stats.map((stat, index) => {
                const IconComponent = getIcon(stat.icon)
                return (
                  <motion.div
                    key={index}
                    className="text-white p-6 rounded-2xl text-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      y: -5
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                    </motion.div>
                    <div className="text-3xl font-bold mb-2 text-yellow-400">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
