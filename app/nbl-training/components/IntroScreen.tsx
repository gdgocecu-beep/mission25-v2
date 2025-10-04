"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface IntroScreenProps {
  onStart: () => void
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-400"
              style={{
                width: Math.random() * 4 + 2 + "px",
                height: Math.random() * 4 + 2 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + "s",
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative z-10 max-w-4xl mx-auto px-4 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-3xl border-2 border-cyan-500/30 shadow-2xl overflow-hidden">
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
            <Image src="/npl.jpg" alt="NBL Training" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NBL TRAINING
              </span>
            </h1>

            <p className="text-lg md:text-xl text-cyan-100 mb-8 text-center leading-relaxed max-w-2xl mx-auto">
              The Neutral Buoyancy Laboratory (NBL) is a massive 6.2 million gallon pool at NASA's Johnson Space Center.
              Astronauts train underwater to simulate the weightless environment of space, preparing for spacewalks and
              ISS maintenance missions.
            </p>

            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-cyan-500/20">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Mission Objectives</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">01</div>
                  <div className="text-cyan-300 font-semibold mb-1">Adapt to Gravity</div>
                  <div className="text-sm text-slate-300">Master underwater movement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">02</div>
                  <div className="text-cyan-300 font-semibold mb-1">Collect Tools</div>
                  <div className="text-sm text-slate-300">Gather repair equipment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">03</div>
                  <div className="text-cyan-300 font-semibold mb-1">Repair Ship</div>
                  <div className="text-sm text-slate-300">Complete the mission</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-8 mb-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-slate-800/50 border-cyan-500/30 hover:bg-slate-700/50 hover:border-cyan-400/50 text-cyan-300 rounded-2xl"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
                {soundEnabled ? "Sound On" : "Sound Off"}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={onStart}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-lg shadow-cyan-500/50 animate-pulse-glow"
              >
                START TRAINING
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
