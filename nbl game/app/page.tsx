"use client"

import { useState } from "react"
import IntroScreen from "@/components/intro-screen"
import GameCanvas from "@/components/game-canvas"

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-900 via-blue-900 to-slate-900">
      {!gameStarted ? <IntroScreen onStart={() => setGameStarted(true)} /> : <GameCanvas />}
    </main>
  )
}
