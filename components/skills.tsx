"use client"

import { useState, useEffect } from "react"
import { Target, Film, Users, DollarSign, Award, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        console.log('Skills component - Fetching data...')
        const response = await fetch('/api/resume')
        console.log('Skills component - Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Skills component - Received data:', data)
          console.log('Skills component - Skills data:', data.skills)
          
          // Use skills from API only
          const iconMap: { [key: string]: any } = {
            "Strategic Planning": Target,
            "Media Production": Film,
            "Team Leadership": Users,
            "Business Development": DollarSign,
            "HR Management": Award,
            "Multilingual Communication": Globe,
          }

          const formattedSkills = data.skills.map((skill: any) => ({
            icon: iconMap[skill.name] || Target,
            title: skill.name,
            description: `${skill.level}`
          }))

          console.log('Skills component - Formatted skills:', formattedSkills)
          setSkills(formattedSkills)
        } else {
          console.error('Skills component - API error:', response.status)
        }
      } catch (error) {
        console.error('Skills component - Failed to fetch skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-blue-600 dark:text-blue-400">Loading skills...</div>
        </div>
      </section>
    )
  }

  console.log('Skills component - Final render state:', { loading, skills: skills.length })

  // Show section even if no data
  if (skills.length === 0) {
    return (
      <motion.section
        className="py-24 bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Core Competencies
          </motion.h2>
          <motion.div
            className="w-16 h-1 mb-12 bg-yellow-400"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
          <div className="text-center text-gray-500 dark:text-gray-400">
            No skills data available. Please add skills through the admin panel.
          </div>
        </div>
      </motion.section>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <motion.section
      className="py-24 bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Core Competencies
        </motion.h2>
        <motion.div
          className="w-16 h-1 mb-12 bg-yellow-400"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-blue-50 dark:bg-gray-800"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(26, 77, 161, 0.15)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="p-3 rounded-full bg-blue-600 dark:bg-blue-700"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {skill.title}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{skill.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
