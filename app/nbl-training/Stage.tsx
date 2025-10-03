"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function Stage({ background = "/nbl-bg.jpg", initialLevel = 1 }: { background?: string; initialLevel?: number }) {
  const [weightlessness, setWeightlessness] = useState(50)
  const [gameStarted, setGameStarted] = useState(false)
  const [targetZone, setTargetZone] = useState({ min: 48, max: 52 })
  const [isComplete, setIsComplete] = useState(false)
  const [level, setLevel] = useState(initialLevel)

  useEffect(() => {
    if (!gameStarted) return
    const timer = setInterval(() => {
      setTargetZone((prev) => {
        const center = 45 + Math.random() * 10
        const range = Math.max(2, 5 - level * 0.5)
        return { min: center - range, max: center + range }
      })
    }, 2500)
    return () => clearInterval(timer)
  }, [gameStarted, level])

  useEffect(() => {
    if (!gameStarted) return
    if (weightlessness >= targetZone.min && weightlessness <= targetZone.max) {
      setIsComplete(true)
    } else {
      setIsComplete(false)
    }
  }, [weightlessness, targetZone, gameStarted])

  const start = () => {
    setGameStarted(true)
    setIsComplete(false)
    setTargetZone({ min: 48, max: 52 })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto rounded-2xl overflow-hidden shadow-xl" style={{ maxWidth: 1000 }}>
        <div style={{ height: 600 }} className="relative bg-slate-900">
          <div className="absolute inset-0">
            <Image src={background} alt="background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div style={{ top: `${85 - weightlessness * 0.7}%` }} className="absolute left-1/2 -translate-x-1/2 z-10 transition-top duration-300">
            <div className="w-40">
              <Image src="/ast2.png" width={160} height={160} alt="astronaut" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">Buoyancy</div>
            <div className="text-cyan-300">{weightlessness}%</div>
          </div>
          <div className="mt-4">
            <Slider value={[weightlessness]} onValueChange={(v) => setWeightlessness(v[0])} min={0} max={100} />
          </div>

          {!gameStarted ? (
            <Button onClick={start} className="mt-4 w-full">Start</Button>
          ) : (
            <div className="mt-4 text-green-300">{isComplete ? "Perfect!" : "Adjust to target"}</div>
          )}
        </div>
      </div>
    </div>
  )
}
