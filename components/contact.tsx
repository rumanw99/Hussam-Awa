"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MapPin, Phone, Mail, Linkedin, Send, MessageCircle, User, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function Contact() {
  const { toast } = useToast()
  const [contactData, setContactData] = useState({
    email: 'hussam.awa@icloud.com',
    phone: '+971 50 1883240',
    location: 'Dubai Sports City, UAE',
    linkedin: 'https://www.linkedin.com/in/hussam-awa-aaa47998/'
  })
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/contact')
        if (response.ok) {
          const data = await response.json()
          setContactData(data)
        }
      } catch (error) {
        console.error('Failed to fetch contact data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContactData()
  }, [])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Here you would typically send the data to your backend
    console.log(values)
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I will get back to you soon.",
    })
    form.reset()
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: contactData.location,
    },
    {
      icon: Phone,
      title: "Phone",
      content: contactData.phone,
    },
    {
      icon: Mail,
      title: "Email",
      content: contactData.email,
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      content: contactData.linkedin.replace('https://', '').replace('http://', ''),
      link: contactData.linkedin,
    },
  ]

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Get In Touch
        </motion.h2>
        <motion.div
          className="w-16 h-1 mb-12 bg-yellow-400"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        />

        {/* Contact Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            </motion.div>
            <div className="text-2xl font-bold mb-2">Quick Response</div>
            <div className="text-blue-100 text-sm">Within 24 hours</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Globe className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            </motion.div>
            <div className="text-2xl font-bold mb-2">Global Reach</div>
            <div className="text-yellow-100 text-sm">Dubai & Worldwide</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <User className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            </motion.div>
            <div className="text-2xl font-bold mb-2">Professional</div>
            <div className="text-blue-100 text-sm">12+ Years Experience</div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-gray-700"
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
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                />
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Contact Information
                </h3>
              </div>
              
              <motion.div
                className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  I'm an Executive Producer, HR, Sales Manager and Marketing Manager with 12+ years of experience in the media industry. 
                  I'm currently in Dubai and open to any opportunity. Feel free to contact me for any inquiries or to discuss potential collaborations.
                </p>
              </motion.div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div
                        className="p-4 rounded-2xl flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-2 text-blue-600 dark:text-blue-400 text-lg">
                          {info.title}
                        </h4>
                        {info.link ? (
                          <a
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-300 transition-colors hover:text-yellow-400 dark:hover:text-yellow-400 font-medium"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 font-medium">{info.content}</p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-gray-700"
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
                  transition={{ duration: 0.6, delay: 1.0 }}
                  viewport={{ once: true }}
                />
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Send Me a Message
                </h3>
              </div>

              <motion.div
                className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-yellow-200 dark:border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  <strong>Available for:</strong> Executive Producer roles, Marketing & Sales Management positions, HR Management opportunities, 
                  Media Production projects, Event Management, and Business Development collaborations.
                </p>
              </motion.div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                    viewport={{ once: true }}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="rounded-xl border-2 border-blue-200 dark:border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                              placeholder="Enter your full name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 }}
                    viewport={{ once: true }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              {...field} 
                              className="rounded-xl border-2 border-blue-200 dark:border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                              placeholder="Enter your email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 }}
                    viewport={{ once: true }}
                  >
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Your Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={4} 
                              {...field} 
                              className="rounded-xl border-2 border-blue-200 dark:border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                              placeholder="Tell me about your project or opportunity..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.5 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-bold text-lg py-4 rounded-xl transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-blue-600 hover:to-blue-700 hover:text-yellow-400 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
