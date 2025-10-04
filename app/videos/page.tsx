"use client"

import { useState, useEffect, useRef } from "react"

interface Video {
  id: number
  title: string
  description: string
  impact: string
  videoUrl: string
  embedUrl?: string
  likes: number
  comments: number
  saves: number
  shares: number
}

const videos: Video[] = [
  {
    id: 1,
    title: "Short: Water from Space",
    description: "How NASA's view from space saves water on Earth",
    impact: "Micro-moments from orbit",
    videoUrl: "",
    embedUrl:
      "https://www.youtube.com/embed/Cy1vueAtA3k?autoplay=1&controls=0&rel=0&playsinline=1&loop=1&playlist=Cy1vueAtA3k",
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
  },
  {
    id: 2,
    title: "Short: Space Moments",
    description: "Short clip",
    impact: "Micro-moments",
    videoUrl: "",
    embedUrl:
      "https://www.youtube.com/embed/xXNbNVJuikQ?autoplay=1&controls=0&rel=0&playsinline=1&loop=1&playlist=xXNbNVJuikQ",
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
  },
]

export default function BenefitsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= videos.length || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (isTransitioning) return

    if (e.deltaY > 0 && currentIndex < videos.length - 1) {
      scrollToIndex(currentIndex + 1)
    } else if (e.deltaY < 0 && currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < videos.length - 1) {
        scrollToIndex(currentIndex + 1)
      } else if (diff < 0 && currentIndex > 0) {
        scrollToIndex(currentIndex - 1)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [currentIndex, isTransitioning])

  const currentVideo = videos[currentIndex]

  return (
    <main ref={containerRef} className="h-screen w-screen overflow-hidden bg-black relative">
      <iframe
        src={currentVideo.embedUrl}
        title={currentVideo.title}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />

      {/* simple top dots to switch videos */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-white" : "w-1 bg-white/40"}`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>
    </main>
  )
}
