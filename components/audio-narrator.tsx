"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioNarratorProps {
  text: string
  autoPlay?: boolean
  language?: string
}

export function AudioNarrator({ text, autoPlay = false, language = "en" }: AudioNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [])

  useEffect(() => {
    if (autoPlay && isSupported && text) {
      handleSpeak()
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [text, autoPlay, isSupported])

  const handleSpeak = () => {
    if (!isSupported) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === "ar" ? "ar-SA" : "en-US"
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  if (!isSupported) return null

  return (
    <Button
      onClick={handleSpeak}
      variant="outline"
      size="icon"
      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
    >
      {isPlaying ? <VolumeX className="h-4 w-4 text-cyan-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
    </Button>
  )
}
