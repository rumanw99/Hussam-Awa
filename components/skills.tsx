"use client"

import { useState, useEffect } from "react"
import { Target, Film, Users, DollarSign, Award, Globe, TrendingUp, Briefcase, MessageSquare, Calendar, BarChart3, Zap } from "lucide-react"
import { motion } from "framer-motion"

// Helper function to categorize skills
const getSkillCategory = (skillName: string) => {
  if (skillName.includes('Strategic') || skillName.includes('Planning')) return 'Strategy'
  if (skillName.includes('Team') || skillName.includes('Leadership') || skillName.includes('HR')) return 'Management'
  if (skillName.includes('Media') || skillName.includes('Content') || skillName.includes('Production')) return 'Media'
  if (skillName.includes('Marketing') || skillName.includes('Sales') || skillName.includes('Business')) return 'Business'
  if (skillName.includes('Event') || skillName.includes('Talent') || skillName.includes('Celebrity')) return 'Events'
  return 'General'
}

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
          
          // Enhanced icon mapping with more specific icons
          const iconMap: { [key: string]: any } = {
            "Strategic Planning and Execution": Target,
            "Team Leadership and Communication": Users,
            "Talent Management and Scheduling": Calendar,
            "Logistics and Operations Management": Globe,
            "Budgeting and Negotiation": DollarSign,
            "Marketing Strategy and Implementation": TrendingUp,
            "Media Relations and Communication": MessageSquare,
            "Celebrity and Influencer Relations": Zap,
            "Multimedia Content Production": Film,
            "Event Management and Coordination": Award,
            "HR Management and Performance Systems": Briefcase,
            "Business Development and Sales": BarChart3,
          }

          const formattedSkills = data.skills.map((skill: any) => ({
            icon: iconMap[skill.name] || Target,
            title: skill.name,
            level: skill.level,
            description: `${skill.level}% Proficiency`,
            category: getSkillCategory(skill.name)
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
        
        {/* Skills Summary */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg">
            <div className="text-3xl font-bold mb-2">{skills.length}</div>
            <div className="text-blue-100 text-sm">Total Skills</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-lg">
            <div className="text-3xl font-bold mb-2">{Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%</div>
            <div className="text-green-100 text-sm">Avg Proficiency</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg">
            <div className="text-3xl font-bold mb-2">12+</div>
            <div className="text-purple-100 text-sm">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-lg">
            <div className="text-3xl font-bold mb-2">5</div>
            <div className="text-orange-100 text-sm">Core Areas</div>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skills.map((skill, index) => {
            const Icon = skill.icon
            const getCategoryColor = (category: string) => {
              switch (category) {
                case 'Strategy': return 'from-blue-500 to-blue-600'
                case 'Management': return 'from-green-500 to-green-600'
                case 'Media': return 'from-purple-500 to-purple-600'
                case 'Business': return 'from-orange-500 to-orange-600'
                case 'Events': return 'from-pink-500 to-pink-600'
                default: return 'from-gray-500 to-gray-600'
              }
            }
            
            const getCategoryBg = (category: string) => {
              switch (category) {
                case 'Strategy': return 'bg-blue-50 dark:bg-blue-900/20'
                case 'Management': return 'bg-green-50 dark:bg-green-900/20'
                case 'Media': return 'bg-purple-50 dark:bg-purple-900/20'
                case 'Business': return 'bg-orange-50 dark:bg-orange-900/20'
                case 'Events': return 'bg-pink-50 dark:bg-pink-900/20'
                default: return 'bg-gray-50 dark:bg-gray-800'
              }
            }
            
            return (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl ${getCategoryBg(skill.category)} border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300`}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${getCategoryColor(skill.category)} shadow-lg`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
                      {skill.title}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(skill.category)} text-white`}>
                      {skill.category}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proficiency</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {skill.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
