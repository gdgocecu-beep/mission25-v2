"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const introRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsMounted(true)

    // Create ambient audio but do not necessarily play it yet.
    audioRef.current = new Audio("/audio/space-ambient-320.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.35

    // Try to autoplay the intro on mount. If the browser permits autoplay, the intro
    // will play and when it ends we start the ambient loop. If autoplay is blocked,
    // the user can still start playback with the button.
    try {
      introRef.current = new Audio("/intro.mp3")
      introRef.current.volume = 0.7
      introRef.current.preload = "auto"

      // Try to play unmuted first (some browsers will allow based on engagement)
      const tryPlayUnmuted = () => {
        if (!introRef.current) return Promise.reject()
        introRef.current.muted = false
        return introRef.current.play()
      }

      // If unmuted play fails, try muted autoplay (muted autoplay is allowed broadly)
      // then attempt to unmute after a short delay and/or on first user gesture.
      tryPlayUnmuted()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          // unmuted autoplay likely blocked — try muted autoplay
          try {
            if (!introRef.current) return
            introRef.current.muted = true
            introRef.current
              .play()
              .then(() => {
                setIsPlaying(true)

                // schedule an unmute attempt after a short delay (best-effort)
                setTimeout(() => {
                  try {
                    if (introRef.current && introRef.current.muted) {
                      introRef.current.muted = false
                      introRef.current.play().catch(() => {})
                    }
                    if (audioRef.current && audioRef.current.paused) {
                      audioRef.current.play().catch(() => {})
                    }
                  } catch {}
                }, 1500)
              })
              .catch(() => {
                // Even muted autoplay failed (rare). We'll rely on a user gesture.
              })
          } catch {}
        })

      // when intro ends, start ambient loop
      introRef.current.addEventListener("ended", () => {
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => {})
            setIsPlaying(true)
          }
        } catch {}
      })

      // best-effort: on first page gesture (click/touch) unmute and play if needed
      const onFirstGesture = () => {
        try {
          if (introRef.current && introRef.current.paused) {
            introRef.current.play().catch(() => {})
          }
          if (introRef.current && introRef.current.muted) {
            introRef.current.muted = false
            introRef.current.play().catch(() => {})
          }
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(() => {})
          }
        } catch {}
        document.removeEventListener("click", onFirstGesture)
        document.removeEventListener("touchstart", onFirstGesture)
      }

      document.addEventListener("click", onFirstGesture, { once: true })
      document.addEventListener("touchstart", onFirstGesture, { once: true })
    } catch (err) {
      // ignore
    }

    return () => {
      try {
        if (introRef.current) {
          introRef.current.pause()
          introRef.current = null
        }
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      } catch {}
    }
  }, [])

  const toggleMusic = () => {
    // if intro is still available and hasn't finished, prefer playing ambient only
    try {
      if (isPlaying) {
        // pause both
        introRef.current && introRef.current.pause()
        audioRef.current && audioRef.current.pause()
        setIsPlaying(false)
        return
      }

      // if intro exists and hasn't ended, try to play it first
      if (introRef.current && !introRef.current.ended) {
        introRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
        return
      }

      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    } catch (err) {
      console.log("Audio toggle failed", err)
    }
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
