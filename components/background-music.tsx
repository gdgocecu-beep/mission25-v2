"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsMounted(true)

    // Create audio element (replace /space-ambient.mp3 with a high-quality file e.g. /audio/space-ambient-320.mp3)
    audioRef.current = new Audio("/audio/space-ambient-320.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.35

    // Do not attempt to autoplay on mount; wait for user gesture via the toggle button.

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Audio play failed:", err)
      })
    }
    setIsPlaying(!isPlaying)
  }

  if (!isMounted) return null

  return (
    <Button
      onClick={toggleMusic}
      size="icon"
      variant="ghost"
      className="fixed top-6 right-6 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </Button>
  )
}
