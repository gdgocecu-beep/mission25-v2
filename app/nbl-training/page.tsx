"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import IntroScreen from "./components/IntroScreen"
import GameCanvas from "./components/GameCanvas"

export default function NBLTrainingPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; language: string } | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    } else {
      router.push("/")
    }
  }, [router])

  if (!userData) return null

  return (
    <main className="min-h-screen">
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <GameCanvas />
      )}
    </main>
  )
}
