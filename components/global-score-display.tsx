"use client"

import { useState, useEffect } from "react"
import { Trophy } from "lucide-react"

export default function GlobalScoreDisplay() {
  const [totalScore, setTotalScore] = useState(0)
  const [maxScore] = useState(100)

  useEffect(() => {
    const updateScore = () => {
      const score = Number.parseInt(sessionStorage.getItem("totalScore") || "0")
      setTotalScore(Math.min(score, maxScore))
    }

    updateScore()
    const interval = setInterval(updateScore, 1000)

    return () => clearInterval(interval)
  }, [maxScore])

  if (totalScore === 0) return null

  const percentage = (totalScore / maxScore) * 100

  return (
    <div className="fixed top-6 right-6 z-50 bg-gradient-to-br from-yellow-900/80 to-orange-900/80 backdrop-blur-xl rounded-2xl px-6 py-4 border-2 border-yellow-500/50 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-400 animate-pulse" />
        <div>
          <div className="text-xs text-yellow-300 font-bold tracking-wider font-orbitron">MISSION SCORE</div>
          <div className="text-3xl font-bold text-white font-orbitron">
            {totalScore}/{maxScore}
          </div>
        </div>
      </div>
      <div className="mt-3 w-full h-2 bg-black/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
