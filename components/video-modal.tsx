"use client"

import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface VideoModalProps {
  video: {
    src: string
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
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

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
            whileTap={{ scale: 0.9 }}
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
            whileTap={{ scale: 0.9 }}
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
          whileTap={{ scale: 0.9 }}
          aria-label="Close video modal"
        >
          <X className="w-7 h-7" />
        </motion.button>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-400/20">
          <video
            src={video.src}
            controls
            preload="metadata"
            className="w-full h-full object-contain"
            controlsList="nodownload"
            playsInline
            webkit-playsinline="true"
            onError={(e) => {
              console.error('Video load error:', e);
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
              const errorDiv = document.createElement('div');
              errorDiv.className = 'w-full h-full flex items-center justify-center text-white';
              errorDiv.innerHTML = `
                <div class="text-center">
                  <div class="text-6xl mb-4">🎥</div>
                  <h3 class="text-xl font-bold mb-2">Video Not Available</h3>
                  <p class="text-gray-300">This video is currently unavailable</p>
                </div>
              `;
              target.parentNode?.appendChild(errorDiv);
            }}
          />
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
              whileTap={{ scale: 0.95 }}
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
              whileTap={{ scale: 0.95 }}
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
