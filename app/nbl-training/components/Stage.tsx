"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function Stage({ background = "/nbl-bg.jpg", initialLevel = 1 }: { background?: string; initialLevel?: number }) {
  const [weightlessness, setWeightlessness] = useState(50)
  const [gameStarted, setGameStarted] = useState(false)
  const [targetZone, setTargetZone] = useState({ min: 48, max: 52 })
  const [isComplete, setIsComplete] = useState(false)
  const [level, setLevel] = useState(initialLevel)

  // physics state (posY in percent, 0 top - 100 bottom)
  const [posY, setPosY] = useState(30)
  const velRef = useRef(0) // percent per second
  const posRef = useRef(posY)
  posRef.current = posY

  // horizontal player position
  const [playerX, setPlayerX] = useState(50)
  const playerXRef = useRef(playerX)
  playerXRef.current = playerX

  // Level 2 tools
  const [tools, setTools] = useState<Array<{ id: number; x: number; y: number; collected: boolean }>>([])

  const rafRef = useRef<number | null>(null)

  const GRAVITY = 25 // percent per second^2
  const MAX_THRUST = 40 // upward accel at 100% slider

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
    // keep original target detection based on slider
    if (weightlessness >= targetZone.min && weightlessness <= targetZone.max) {
      setIsComplete(true)
    } else {
      setIsComplete(false)
    }
  }, [weightlessness, targetZone, gameStarted])

  // spawn tools for level 2
  useEffect(() => {
    if (!gameStarted) return
    if (level === 2) {
      const generated = Array.from({ length: 4 }).map((_, i) => ({ id: i + 1, x: 20 + i * 15 + Math.random() * 8, y: 30 + Math.random() * 40, collected: false }))
      setTools(generated)
    } else {
      setTools([])
    }
  }, [level, gameStarted])

  // keyboard controls for left/right
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!gameStarted) return
      if (e.key === "ArrowLeft" || e.key === "a") setPlayerX((p) => Math.max(5, p - 3))
      if (e.key === "ArrowRight" || e.key === "d") setPlayerX((p) => Math.min(95, p + 3))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [gameStarted])

  // physics loop (rAF)
  useEffect(() => {
    if (!gameStarted) return
    let last = performance.now()
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) // clamp dt
      last = now

      // thrust upward (negative accel)
      const thrust = (weightlessness / 100) * MAX_THRUST
      const accel = GRAVITY - thrust // positive pulls down

      // update velocity and position
      velRef.current += accel * dt
      let newPos = posRef.current + velRef.current * dt
      // clamp
      if (newPos > 95) {
        newPos = 95
        velRef.current = Math.min(0, velRef.current)
      }
      if (newPos < 2) {
        newPos = 2
        velRef.current = Math.max(0, velRef.current)
      }
      posRef.current = newPos
      setPosY(newPos)

      // auto-collect tools on proximity in level 2
      if (level === 2 && tools.length > 0) {
        setTools((prev) => {
          const updated = prev.map((t) => {
            if (t.collected) return t
            const dx = Math.abs(playerXRef.current - t.x)
            const dy = Math.abs(posRef.current - t.y)
            if (dx < 6 && dy < 10) {
              return { ...t, collected: true }
            }
            return t
          })
          return updated
        })
      }

      // check level completions
      if (level === 1 && isComplete) {
        // advance
        setTimeout(() => setLevel(2), 700)
      }

      if (level === 2 && tools.length > 0 && tools.every((t) => t.collected)) {
        setTimeout(() => setLevel(3), 700)
      }

      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [gameStarted, weightlessness, level, tools, isComplete])

  const start = () => {
    setGameStarted(true)
    setIsComplete(false)
    setTargetZone({ min: 48, max: 52 })
    // reset physics
    velRef.current = 0
    setPosY(30)
    setPlayerX(50)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto rounded-2xl overflow-hidden shadow-xl" style={{ maxWidth: 1000 }}>
        <div style={{ height: 600 }} className="relative bg-slate-900">
          <div className="absolute inset-0">
            <Image src={background} alt="background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div style={{ left: `${playerX}%`, top: `${posY}%`, transform: "translate(-50%, -50%)" }} className="absolute z-10 transition-all duration-150">
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
            <div className="mt-4 text-green-300">{level === 1 ? (isComplete ? "Perfect!" : "Adjust to target") : `Level ${level} — move with ← →`}</div>
          )}
        </div>
      </div>
    </div>
  )
}
