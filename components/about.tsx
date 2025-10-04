"use client"

import { Award, DollarSign, Users, Briefcase } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [aboutData, setAboutData] = useState({
    title: 'Golden Visa Holder',
    profileImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg',
    content: 'Experienced professional with a proven track record in media production, marketing, and team leadership. Golden Visa holder with extensive experience in Dubai\'s dynamic business environment. I specialize in creating compelling visual content and leading high-performing teams to deliver exceptional results.',
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
            title: data.title || 'Golden Visa Holder',
            profileImage: data.profileImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg',
            content: data.content || 'Experienced professional with a proven track record in media production, marketing, and team leadership. Golden Visa holder with extensive experience in Dubai\'s dynamic business environment.',
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
      className={`py-24 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${
        isVisible ? "animate-fadeIn" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          About Me
        </h2>
        <div className="w-16 h-1 mb-12 bg-yellow-400" />

        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-1 flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-full border-4"
                style={{ borderColor: "#F4B400" }}
              />
              <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
                {aboutData.profileImage ? (
                  <Image
                    src={aboutData.profileImage}
                    alt="Hussam Awa"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">HA</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 animate-slideUp">
            <div className="p-8 rounded-lg bg-blue-50 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-yellow-400" />
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {aboutData.title}
                </h3>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : aboutData.content ? (
                  <p className="whitespace-pre-wrap">{aboutData.content}</p>
                ) : (
                  <p className="text-gray-500 italic">No content available</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {aboutData.stats.map((stat, index) => {
                const IconComponent = getIcon(stat.icon)
                return (
                  <div
                    key={index}
                    className="text-white p-6 rounded-lg text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-blue-600 dark:bg-blue-700"
                    style={{ boxShadow: "0 0 20px rgba(244, 180, 0, 0.5)" }}
                  >
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-3xl font-bold mb-1 text-yellow-400">{stat.value}</div>
                    <div className="text-sm">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
