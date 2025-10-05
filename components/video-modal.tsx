"use client"

import { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface VideoModalProps {
  video: {
    src: string
    url?: string // Add url as optional for compatibility
    title: string
    description: string
  }
  videos: any[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function VideoModal({ video, videos, currentIndex, onClose, onNext, onPrev }: VideoModalProps) {
  const [videoError, setVideoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    setVideoError(false)
    setIsLoading(true)
    return () => {
      document.body.style.overflow = ""
    }
  }, [video.src])

  // Auto-play video when modal opens
  useEffect(() => {
    const videoElement = document.querySelector('video')
    if (videoElement) {
      // Try to play the video with sound
      const playVideo = async () => {
        try {
          // Ensure video is unmuted
          videoElement.muted = false
          videoElement.volume = 1.0
          await videoElement.play()
          console.log('Video auto-played successfully with sound')
        } catch (error) {
          console.log('Auto-play prevented by browser:', error)
          // This is normal - browsers often prevent auto-play
        }
      }
      
      // Small delay to ensure video is ready
      setTimeout(playVideo, 100)
    }
  }, [video.src])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        onNext()
      } else if (e.key === "ArrowLeft") {
        onPrev()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-6"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Navigation buttons */}
      {videos.length > 1 && (
        <>
          <motion.button
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-all duration-300 z-10 bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous video"
            whileHover={{ scale: 1.1, x: -5 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-all duration-300 z-10 bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next video"
            whileHover={{ scale: 1.1, x: 5 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      <motion.div
        className="relative w-full max-w-[95vw] lg:max-w-[85vw] max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <motion.button
          className="absolute top-2 right-2 text-white hover:text-yellow-400 transition-colors p-3 rounded-full bg-black/70 hover:bg-black/90 z-10 shadow-lg"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          aria-label="Close video modal"
        >
          <X className="w-7 h-7" />
        </motion.button>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-400/20 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-lg">Loading video...</p>
              </div>
            </div>
          )}
          
          {videoError ? (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🎥</div>
                <h3 className="text-xl font-bold mb-2">Video Not Available</h3>
                <p className="text-gray-300 mb-4">This video is currently unavailable</p>
                <button 
                  onClick={() => {
                    setVideoError(false)
                    setIsLoading(true)
                    window.location.reload()
                  }} 
                  className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <video
              src={video.src || video.url}
              controls
              autoPlay
              preload="metadata"
              className="w-full h-full object-contain"
              controlsList="nodownload"
              playsInline
              webkit-playsinline="true"
              onError={(e) => {
                console.error('Video load error:', e);
                console.error('Video src:', video.src || video.url);
                setVideoError(true)
                setIsLoading(false)
              }}
              onLoadStart={() => {
                console.log('Video loading started:', video.src || video.url);
              }}
              onCanPlay={() => {
                console.log('Video can play:', video.src || video.url);
                setIsLoading(false)
              }}
              onLoadedData={() => {
                console.log('Video data loaded:', video.src || video.url);
                setIsLoading(false)
              }}
              onLoadedMetadata={() => {
                console.log('Video metadata loaded:', video.src || video.url);
              }}
              onPlay={(e) => {
                console.log('Video started playing:', video.src || video.url);
                setIsLoading(false)
                // Ensure sound is enabled
                const videoElement = e.target as HTMLVideoElement
                videoElement.muted = false
                videoElement.volume = 1.0
              }}
              onPlaying={(e) => {
                console.log('Video is playing:', video.src || video.url);
                setIsLoading(false)
                // Ensure sound is enabled
                const videoElement = e.target as HTMLVideoElement
                videoElement.muted = false
                videoElement.volume = 1.0
              }}
              onPause={() => {
                console.log('Video paused:', video.src || video.url);
              }}
              onEnded={() => {
                console.log('Video ended:', video.src || video.url);
              }}
            />
          )}
        </div>

        <motion.div 
          className="mt-6 text-white bg-gradient-to-br from-yellow-400/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-2 text-yellow-400">{video.title}</h3>
          <p className="text-lg text-gray-200 mb-6">{video.description}</p>

          <div className="flex justify-center gap-4">
            <motion.button
              onClick={onPrev}
              disabled={videos.length <= 1}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, x: -5 }}
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>
            <motion.button
              onClick={onNext}
              disabled={videos.length <= 1}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, x: 5 }}
              aria-label="Next video"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
