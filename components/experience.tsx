'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Experience() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        console.log('Experience component - Fetching data...')
        const response = await fetch('/api/resume')
        console.log('Experience component - Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Experience component - Received data:', data)
          console.log('Experience component - Experience data:', data.experience)
          
          // Use experiences from API only
          const formattedExperiences = data.experience.map((exp: any) => ({
            title: exp.position,
            company: exp.company,
            period: `${exp.startDate} – ${exp.endDate || 'Present'}`,
            responsibilities: exp.description.split('\n').filter((line: string) => line.trim())
          }))

          console.log('Experience component - Formatted experiences:', formattedExperiences)
          setExperiences(formattedExperiences)
        } else {
          console.error('Experience component - API error:', response.status)
        }
      } catch (error) {
        console.error('Experience component - Failed to fetch experience:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [])

  if (loading) {
    return (
      <section id="experience" className="py-24 bg-blue-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-blue-600 dark:text-blue-400">Loading experience...</div>
        </div>
      </section>
    )
  }

  // Show section even if no data
  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-24 bg-blue-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Professional Journey
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A Timeline of Impactful Roles
          </motion.p>
          <div className="w-16 h-1 mb-12 bg-yellow-400" />
          <div className="text-center text-gray-500 dark:text-gray-400">
            No experience data available. Please add experience through the admin panel.
          </div>
        </div>
      </section>
    )
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="experience" className="py-24 bg-blue-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Professional Journey
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 mb-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          A Timeline of Impactful Roles
        </motion.p>
        <div className="w-16 h-1 mb-12 bg-yellow-400" />

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(26, 77, 161, 0.15)" }}
                tabIndex={0}
                aria-label={`${exp.title} at ${exp.company} from ${exp.period}`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                      {exp.title}
                    </h3>
                    <p className="font-semibold mb-1 text-yellow-400">
                      {exp.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">{exp.period}</p>
                  </div>
                </div>

                <div
                  className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-4 transform -translate-x-1/2 bg-yellow-400 border-blue-600 dark:border-blue-400 hover:scale-110 transition-transform"
                />

                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                  <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="text-yellow-400 mt-1 w-4 h-4 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
