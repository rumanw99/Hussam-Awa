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
            title: skill.name || 'Unknown Skill',
            level: Number(skill.level) || 0,
            description: `${Number(skill.level) || 0}% Proficiency`,
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
        
        {/* Enhanced Skills Summary */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-3xl font-bold mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 200 }}
            >
              {skills.length || 0}
            </motion.div>
            <div className="text-blue-100 text-sm font-medium">Total Skills</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-3xl font-bold mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 1.0, type: "spring", stiffness: 200 }}
            >
              {skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + (Number(skill.level) || 0), 0) / skills.length) : 0}%
            </motion.div>
            <div className="text-yellow-100 text-sm font-medium">Avg Proficiency</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-3xl font-bold mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2, type: "spring", stiffness: 200 }}
            >
              12+
            </motion.div>
            <div className="text-blue-100 text-sm font-medium">Years Experience</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-3xl font-bold mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4, type: "spring", stiffness: 200 }}
            >
              5
            </motion.div>
            <div className="text-yellow-100 text-sm font-medium">Core Areas</div>
          </motion.div>
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
              // Use only blue and yellow colors
              return 'from-blue-500 to-blue-600'
            }
            
            const getCategoryBg = (category: string) => {
              // Use only blue and yellow backgrounds
              return 'bg-blue-50 dark:bg-blue-900/20'
            }
            
            return (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl ${getCategoryBg(skill.category)} border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(244, 180, 0, 0.1) 100%)",
                    boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.2)"
                  }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
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
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                      {skill.category}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proficiency</span>
                    <motion.span 
                      className="text-sm font-bold text-gray-800 dark:text-gray-200"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full relative"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "100%" }}
                        transition={{ duration: 1, delay: index * 0.1 + 1.5 }}
                      viewport={{ once: true }}
                    />
                    </motion.div>
                  </div>
                </div>
                
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
                  viewport={{ once: true }}
                >
                  {skill.description}
                </motion.p>
                
                {/* Floating particles effect */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: index * 0.2 + 0.5
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
