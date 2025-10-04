"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoModal from "./video-modal"
import { X, Play, Sparkles, Camera, Video } from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

// VideoThumbnail component using predefined thumbnails
const VideoThumbnail = ({ src, alt, className, thumbnail }: { src: string; alt: string; className?: string; thumbnail?: string }) => {
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [src])

  const handleImageError = () => {
    setImageError(true)
    setLoading(false)
  }

  return (
    <div className={`relative ${className}`}>
      {loading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <Video className="w-8 h-8 text-gray-400" />
        </div>
      ) : thumbnail && !imageError ? (
        <Image
          src={thumbnail}
          alt={alt}
          fill
          className="object-cover"
          onError={handleImageError}
          onLoad={() => setLoading(false)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-center text-white">
            <Video className="w-16 h-16 mx-auto mb-2 text-white/80" />
            <p className="text-sm font-medium">Video Preview</p>
          </div>
        </div>
      )}
    </div>
  )
}

const Particles = ({ width, height }: { width: number; height: number }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    width: number;
    height: number;
    initialX: number;
    initialY: number;
    animateX: number;
    duration: number;
    delay: number;
  }>>([])

  useEffect(() => {
    // Generate random values only on client side
    setParticles(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
      initialX: Math.random() * width,
      initialY: Math.random() * height,
      animateX: Math.random() * width,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    })))
  }, [width, height])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full opacity-20 ${
            particle.id % 3 === 0 ? 'bg-yellow-400 dark:bg-yellow-300' : particle.id % 3 === 1 ? 'bg-blue-400 dark:bg-blue-300' : 'bg-purple-400 dark:bg-purple-300'
          }`}
          style={{
            width: particle.width,
            height: particle.height,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: 0,
          }}
          animate={{
            y: [null, -height],
            x: [null, particle.animateX],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)

  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Hide header when modal is open
  useEffect(() => {
    const isModalOpen = selectedPhoto !== null || selectedVideoIndex !== null
    if (isModalOpen) {
      document.body.setAttribute('data-modal-open', 'true')
    } else {
      document.body.removeAttribute('data-modal-open')
    }
    
    return () => {
      document.body.removeAttribute('data-modal-open')
    }
  }, [selectedPhoto, selectedVideoIndex])

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        console.log('Portfolio component - Fetching photos...')
        // Fetch photos from API
        const photosResponse = await fetch('/api/photos')
        console.log('Portfolio component - Photos response status:', photosResponse.status)
        const photosData = photosResponse.ok ? await photosResponse.json() : []
        console.log('Portfolio component - Photos data received:', photosData.length)

        console.log('Portfolio component - Fetching videos...')
        // Fetch videos from API
        const videosResponse = await fetch('/api/videos')
        console.log('Portfolio component - Videos response status:', videosResponse.status)
        const videosData = videosResponse.ok ? await videosResponse.json() : []
        console.log('Portfolio component - Videos data received:', videosData.length)

        // Use photos from API only
        setPhotos(photosData)
        console.log('Portfolio component - Setting photos count:', photosData.length)

        // Use videos from API only (convert format)
        const formattedVideos = videosData.map((v: any) => ({
          src: v.url,
          thumbnail: v.thumbnail || '/placeholder.svg',
          title: v.title,
          description: v.description
        }))
        console.log('Portfolio component - Formatted videos:', formattedVideos.length)
        setVideos(formattedVideos)

      } catch (error) {
        console.error('Portfolio component - Failed to fetch portfolio data:', error)
      } finally {
        console.log('Portfolio component - Setting loading to false')
        setLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => new Set(prev).add(url))
  }

  const handleImageError = (url: string) => {
    // Fallback to placeholder
    setLoadedImages(prev => new Set(prev).add(url))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const childTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 15
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }


  const categories = ["All", "Wedding", "Corporate", "Portrait", "Event"]
  const filteredPhotos = selectedCategory === "All" ? photos : photos.filter(photo => photo.category === selectedCategory)

  if (loading) {
    return (
      <section className="py-24 text-white relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                className="w-8 h-8 border-2 border-yellow-300 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-yellow-300 text-xl font-semibold">Loading Portfolio</span>
            </div>
            <div className="w-32 h-1 bg-yellow-300/30 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-yellow-300 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-24 text-white relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Particles width={windowSize.width} height={windowSize.height} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="relative"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400 dark:text-yellow-300 drop-shadow-2xl" />
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-2xl">
          Portfolio
        </h2>
          </motion.div>
          
          <motion.div
            className="relative inline-block mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full shadow-2xl" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.5)",
                  "0 0 40px rgba(251, 191, 36, 0.8)",
                  "0 0 20px rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          <motion.p
            className="text-xl md:text-2xl mb-8 text-yellow-100 dark:text-yellow-50 max-w-4xl mx-auto font-light tracking-wide leading-relaxed drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
          Explore my diverse collection of photography and videography work, showcasing moments captured with passion and precision across various events and styles.
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center gap-2 text-yellow-300/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">Professional Photography & Videography</span>
            <Video className="w-5 h-5" />
          </motion.div>
        </motion.div>

        <motion.div 
          className="mb-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-500 overflow-hidden group ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 shadow-2xl shadow-yellow-500/50"
                  : "bg-white/10 backdrop-blur-sm border-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/20 hover:border-yellow-400 hover:text-yellow-200"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: selectedCategory === category 
                  ? "0 10px 30px rgba(251, 191, 36, 0.6)"
                  : "0 5px 20px rgba(251, 191, 36, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={selectedCategory === category}
              aria-label={`Filter portfolio by ${category}`}
            >
              {selectedCategory === category && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
              {category}
                {selectedCategory === category && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                )}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
        <Tabs defaultValue="photos" className="w-full">
            <TabsList className="mb-12 bg-white/10 backdrop-blur-sm border-2 border-yellow-400/30 rounded-2xl p-2 shadow-2xl">
            <TabsTrigger
              value="photos"
                className="relative px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-blue-900 data-[state=active]:shadow-2xl data-[state=active]:shadow-yellow-500/50 transition-all duration-500 hover:bg-yellow-400/20 hover:text-yellow-200 group"
            >
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
              Photos
                </span>
            </TabsTrigger>
            <TabsTrigger
              value="videos"
                className="relative px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-blue-900 data-[state=active]:shadow-2xl data-[state=active]:shadow-yellow-500/50 transition-all duration-500 hover:bg-yellow-400/20 hover:text-yellow-200 group"
            >
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
              Videos
                </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredPhotos.length === 0 ? (
                  <motion.div
                    className="col-span-full text-center py-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Camera className="w-16 h-16 text-yellow-400/50" />
                      <p className="text-xl text-yellow-400 font-semibold">No photos available in this category</p>
                      <p className="text-yellow-300/70">Try selecting a different category</p>
                    </div>
                  </motion.div>
              ) : (
                filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                      className="group relative overflow-hidden rounded-2xl shadow-2xl aspect-square cursor-pointer bg-gradient-to-br from-yellow-400/10 to-blue-500/10 backdrop-blur-sm border border-yellow-400/20"
                    onClick={() => setSelectedPhoto(photo.url)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedPhoto(photo.url)
                      }
                    }}
                    aria-label={`${photo.title} - ${photo.description}`}
                    variants={itemVariants}
                    transition={childTransition}
                    whileHover={{
                        scale: 1.08,
                        y: -8,
                        boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.2)",
                        transition: { duration: 0.4, ease: "easeOut" }
                    }}
                  >
                    {!loadedImages.has(photo.url) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-blue-500/20 animate-pulse rounded-2xl" />
                    )}
                    <Image
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.title}
                      fill
                      loading="lazy"
                      className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                        loadedImages.has(photo.url) ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(photo.url)}
                      onError={() => handleImageError(photo.url)}
                    />
                      
                      {/* Enhanced overlay with gradient and glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{photo.title}</h3>
                          <p className="text-sm text-yellow-100 mb-4 leading-relaxed">{photo.description}</p>
                          <div className="flex items-center gap-2 text-yellow-300">
                            <Camera className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">View Details</span>
                    </div>
                        </motion.div>
                      </div>
                      
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          boxShadow: "inset 0 0 20px rgba(251, 191, 36, 0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="videos">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                {videos.length === 0 ? (
                  <motion.div
                    className="col-span-full text-center py-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Video className="w-16 h-16 text-yellow-400/50" />
                      <p className="text-xl text-yellow-400 font-semibold">No videos available</p>
                      <p className="text-yellow-300/70">Check back soon for new content</p>
                    </div>
                  </motion.div>
                ) : (
                  videos.map((video, index) => (
                <motion.div
                  key={video.src}
                      className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gradient-to-br from-yellow-400/10 to-blue-500/10 backdrop-blur-sm border border-yellow-400/20"
                  onClick={() => setSelectedVideoIndex(index)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedVideoIndex(index)
                    }
                  }}
                  aria-label={`${video.title} - ${video.description}`}
                  variants={itemVariants}
                  transition={childTransition}
                  whileHover={{
                    scale: 1.05,
                        y: -8,
                        boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.2)",
                        transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  <VideoThumbnail
                    src={video.src}
                    alt={video.title}
                    className="w-full h-full"
                    thumbnail={video.thumbnail}
                  />
                      
                      {/* Enhanced play button overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all duration-500">
                    <motion.div
                          className="rounded-full p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-2xl group-hover:scale-110 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                          <Play className="w-8 h-8 text-blue-900" fill="currentColor" />
                        </motion.div>
                      </div>
                      
                      {/* Enhanced info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">{video.title}</h3>
                          <p className="text-yellow-100 text-sm mb-4 leading-relaxed">{video.description}</p>
                          <div className="flex items-center gap-2 text-yellow-300">
                            <Video className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Watch Video</span>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          boxShadow: "inset 0 0 20px rgba(251, 191, 36, 0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  ))
                )}
            </motion.div>
          </TabsContent>
        </Tabs>
        </motion.div>

        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSelectedPhoto(null)
                } else if (e.key === "ArrowRight") {
                  const currentIndex = filteredPhotos.findIndex(p => p.url === selectedPhoto)
                  const nextIndex = (currentIndex + 1) % filteredPhotos.length
                  setSelectedPhoto(filteredPhotos[nextIndex].url)
                } else if (e.key === "ArrowLeft") {
                  const currentIndex = filteredPhotos.findIndex(p => p.url === selectedPhoto)
                  const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                  setSelectedPhoto(filteredPhotos[prevIndex].url)
                }
              }}
            >
              {/* Enhanced close button */}
              <motion.button
                className="absolute top-6 right-6 text-yellow-400 hover:text-yellow-300 transition-all duration-300 z-10 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-8 h-8 drop-shadow-lg" />
              </motion.button>
              
              {/* Enhanced navigation buttons */}
              <motion.button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-all duration-300 z-10 bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = filteredPhotos.findIndex(p => p.url === selectedPhoto)
                const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                setSelectedPhoto(filteredPhotos[prevIndex].url)
              }}
              aria-label="Previous photo"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl font-bold">‹</span>
              </motion.button>
              
              <motion.button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-all duration-300 z-10 bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = filteredPhotos.findIndex(p => p.url === selectedPhoto)
                const nextIndex = (currentIndex + 1) % filteredPhotos.length
                setSelectedPhoto(filteredPhotos[nextIndex].url)
              }}
              aria-label="Next photo"
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl font-bold">›</span>
              </motion.button>
              
              {/* Enhanced image container */}
            <motion.div
                className="relative w-[90vw] h-[90vh] bg-gradient-to-br from-yellow-400/10 to-blue-500/10 rounded-3xl p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Image
                src={selectedPhoto || "/placeholder.svg"}
                alt={filteredPhotos.find(p => p.url === selectedPhoto)?.title || "Gallery image"}
                fill
                className="object-contain rounded-2xl shadow-2xl"
              />
                
                {/* Photo info overlay */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-white text-lg font-bold mb-1">
                    {filteredPhotos.find(p => p.url === selectedPhoto)?.title || "Untitled"}
                  </h3>
                  <p className="text-yellow-200 text-sm">
                    {filteredPhotos.find(p => p.url === selectedPhoto)?.description || "No description available"}
                  </p>
                </motion.div>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedVideoIndex !== null && <VideoModal video={videos[selectedVideoIndex]} videos={videos} currentIndex={selectedVideoIndex} onClose={() => setSelectedVideoIndex(null)} onNext={() => setSelectedVideoIndex((selectedVideoIndex + 1) % videos.length)} onPrev={() => setSelectedVideoIndex((selectedVideoIndex - 1 + videos.length) % videos.length)} />}
      </div>
    </section>
  )
}
