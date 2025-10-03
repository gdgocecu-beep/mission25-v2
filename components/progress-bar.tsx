"use client"

import { useEffect, useState } from "react"

export function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative w-full max-w-2xl px-8">
        {/* ISS Animation */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4 animate-pulse">🛰️</div>
          <h2 className="text-3xl font-bold text-white mb-2">Preparing Your Mission</h2>
          <p className="text-cyan-400 font-mono text-sm">Initializing ISS Systems...</p>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="mt-4 text-center">
          <span className="text-4xl font-bold text-cyan-400 font-mono">{progress}%</span>
        </div>

        {/* Status Messages */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-slate-400 text-sm font-mono">
            {progress < 30 && "Loading astronaut profile..."}
            {progress >= 30 && progress < 60 && "Connecting to ISS systems..."}
            {progress >= 60 && progress < 90 && "Calibrating training modules..."}
            {progress >= 90 && "Ready for launch!"}
          </p>
        </div>
      </div>
    </div>
  )
}
