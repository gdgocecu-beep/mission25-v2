"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, Timer, Trophy, Info } from "lucide-react"
import Image from "next/image"
import { translations, type Language } from "@/lib/translations"
import { AudioNarrator } from "@/components/audio-narrator"

export default function NBLTrainingPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; language: string } | null>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [isComplete, setIsComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [score, setScore] = useState(0)
  const [obstacles, setObstacles] = useState<Array<{ x: number; y: number; type: string }>>([])
  const [tools, setTools] = useState<Array<{ x: number; y: number; collected: boolean }>>([])
  const [collectedTools, setCollectedTools] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [phaseIndex, setPhaseIndex] = useState(0) // 0..2 phases mixed into one level
  const [showPhaseMessage, setShowPhaseMessage] = useState(false)
  const [showNBLInfo, setShowNBLInfo] = useState(false)
  const [showNBLOverlay, setShowNBLOverlay] = useState(true)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false })
  // on-screen control bars removed; keyboard controls remain

  const language = (userData?.language === "Arabic" ? "ar" : "en") as Language
  const t = translations[language]
  const isRTL = language === "ar"

  const phases = [
    {
      id: 0,
      title: language === 'ar' ? 'تدريب أساسي' : 'Basic Training',
      subtitle: language === 'ar' ? 'جمع نقاط للوصول إلى المرحلة التالية' : 'Score points to reach the next phase',
      threshold: 50,
    },
    {
      id: 1,
      title: language === 'ar' ? 'جمع الأدوات' : 'Tool Collection',
      subtitle: language === 'ar' ? 'اجمع الأدوات الثلاثة لفتح التحدي النهائي' : 'Collect 3 tools to unlock the final challenge',
      threshold: 140,
    },
    {
      id: 2,
      title: language === 'ar' ? 'التحدي المتقدم' : 'Expert Challenge',
      subtitle: language === 'ar' ? 'احصل على نقاط إضافية لتنهِ التدريب' : 'Score more points to finish training',
      threshold: 300,
    },
  ]

  useEffect(() => {
    const data = sessionStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    } else {
      router.push("/")
    }
  }, [router])

  // When overlay is visible, pause game and allow user to read/learn
  useEffect(() => {
    if (showNBLOverlay) {
      setGameStarted(false)
    }
  }, [showNBLOverlay])

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStarted(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted])

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') setKeys(prev => ({ ...prev, w: true }))
      if (e.key.toLowerCase() === 'a') setKeys(prev => ({ ...prev, a: true }))
      if (e.key.toLowerCase() === 's') setKeys(prev => ({ ...prev, s: true }))
      if (e.key.toLowerCase() === 'd') setKeys(prev => ({ ...prev, d: true }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') setKeys(prev => ({ ...prev, w: false }))
      if (e.key.toLowerCase() === 'a') setKeys(prev => ({ ...prev, a: false }))
      if (e.key.toLowerCase() === 's') setKeys(prev => ({ ...prev, s: false }))
      if (e.key.toLowerCase() === 'd') setKeys(prev => ({ ...prev, d: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameStarted])

  // Physics and movement
  useEffect(() => {
    if (!gameStarted) return

    // Easier, smoother physics constants
    const GRAVITY = 0.05 // much lower gravity for easier control
    const MOVE_SPEED = 0.35 // horizontal control responsiveness
    const BOOST_POWER = 0.6 // gentler thrust
    const MAX_VELOCITY = 6
    const HORIZONTAL_BOUNDARY = 12 // % from edges
    const SMOOTHING = 0.14 // velocity lerp factor (0-1)

    const gameLoop = setInterval(() => {
      setVelocity(prevVel => {
        // desired velocities computed from input
        let desiredVx = prevVel.x
        let desiredVy = prevVel.y + GRAVITY

        if (keys.w) desiredVy -= BOOST_POWER
        if (keys.a) desiredVx -= MOVE_SPEED
        if (keys.d) desiredVx += MOVE_SPEED

  // keyboard only control (W/A/S/D)

        // Clamp desired velocities
        desiredVx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, desiredVx))
        desiredVy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, desiredVy))

        // Smoothly interpolate current velocity toward desired (simple damping)
        const newVx = prevVel.x + (desiredVx - prevVel.x) * SMOOTHING
        const newVy = prevVel.y + (desiredVy - prevVel.y) * SMOOTHING

        // Update position using the smoothed velocity
        let finalVx = newVx
        let finalVy = newVy

        setPosition(prevPos => {
          let newX = prevPos.x + newVx
          let newY = prevPos.y + newVy

          // World boundaries with margin
          const clampedX = Math.max(HORIZONTAL_BOUNDARY, Math.min(100 - HORIZONTAL_BOUNDARY, newX))
          const clampedY = Math.max(0, Math.min(100, newY))

          // If we've hit a horizontal boundary and velocity is pushing further into it, zero that component
          if (clampedX !== newX) {
            // prevent sticking into side walls
            finalVx = 0
            newX = clampedX
          }

          // If we've hit a vertical boundary and velocity is pushing further into it, zero that component
          if (clampedY !== newY) {
            finalVy = 0
            newY = clampedY
          }

          // Check collisions with obstacles
          obstacles.forEach(obstacle => {
            const dx = newX - obstacle.x
            const dy = newY - obstacle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 8) {
              setScore(prev => Math.max(0, prev - 5))
            }
          })

          // Check tool collection anywhere (tools spawn across phases)
          tools.forEach((tool, index) => {
            if (!tool.collected) {
              const dx = newX - tool.x
              const dy = newY - tool.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              if (distance < 10) {
                setTools(prev => prev.map((t, i) => i === index ? { ...t, collected: true } : t))
                setCollectedTools(prev => prev + 1)
                setScore(prev => prev + 20)
              }
            }
          })

          return { x: newX, y: newY }
        })

        // Return the possibly-adjusted velocities so we don't keep pushing into walls
        return { x: finalVx, y: finalVy }
      })
    }, 1000 / 60)

    return () => clearInterval(gameLoop)
  }, [gameStarted, keys, obstacles, tools])

  // Generate obstacles based on level
  useEffect(() => {
    if (!gameStarted) return

    // unified obstacle generation with mixed difficulty
    const generateObstacles = setInterval(() => {
      const count = 4 + Math.floor(Math.random() * 3) // 4..6
      const newObstacles = Array(count).fill(0).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: Math.random() > 0.6 ? 'asteroid' : 'debris'
      }))
      setObstacles(newObstacles)

      // Spawn some tools occasionally across the mixed level
      if (Math.random() > 0.5) {
        const newTools = Array(1 + Math.floor(Math.random() * 2)).fill(0).map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          collected: false
        }))
        setTools(prev => [...prev, ...newTools])
      }
    }, 2500)

    return () => clearInterval(generateObstacles)
  }, [gameStarted])

  // Background auto-increment removed: points are now gained only through actions (tool collection, scoring events)

  useEffect(() => {
    // Determine current phase based on score and collected tools, show a short message on transition
    let newPhase = phaseIndex
    if (score >= phases[2].threshold) newPhase = 2
    else if (collectedTools >= 3 || score >= phases[1].threshold) newPhase = 1
    else if (score >= phases[0].threshold) newPhase = 0

    if (newPhase !== phaseIndex) {
      setPhaseIndex(newPhase)
      setShowPhaseMessage(true)
      setTimeout(() => setShowPhaseMessage(false), 2200)
    }

    // If we reached final phase and score threshold, complete mission
    if (newPhase === 2 && score >= phases[2].threshold) {
      setShowLevelComplete(true)
      setTimeout(() => router.push('/cupola'), 1800)
    }
  }, [score, collectedTools, phaseIndex, router])

  const startGame = () => {
    setGameStarted(true)
    // If the player is resuming and still has time left, don't reset the clock.
    if (timeLeft <= 0) setTimeLeft(120)
    // Keep current level when resuming; if starting fresh (position at center and level 1 not set), ensure defaults
    if (!gameStarted) {
      setLevel(1)
      setPosition({ x: 50, y: 50 })
      setVelocity({ x: 0, y: 0 })
      setObstacles([])
    }
  }

  // Position is now handled by the physics system

  if (!userData) return null

  return (
    <main
      className={`min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a2847] to-[#0a0e27] text-white relative overflow-hidden font-space-grotesk ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-orbitron">{t.nblTraining}</h1>
          <p className="text-lg text-cyan-400">{t.nblSubtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          {/* NBL info overlay — show once before training */}
          {showNBLOverlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
              <div className="max-w-5xl w-full mx-4 bg-gradient-to-b from-slate-900/90 to-slate-800/80 rounded-3xl overflow-hidden border border-cyan-700/40 shadow-2xl">
                <div className="relative w-full h-96 md:h-[520px]">
                  <Image
                    src="/nasa-neutral-buoyancy-laboratory-pool-with-astrona.jpg"
                    alt="NBL Training Pool"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="p-6 md:p-10">
                  <h2 className="text-3xl font-bold mb-2 font-orbitron">{t.nblTraining}</h2>
                  <p className="text-slate-200 mb-4 leading-relaxed">{t.nblDescription}</p>
                  <div className="flex gap-3">
                    <AudioNarrator text={t.nblDescription} language={language} />
                    <Button
                      onClick={() => {
                        setShowNBLOverlay(false)
                        // start the game after closing overlay
                        startGame()
                      }}
                      size="lg"
                      className="ml-auto bg-cyan-600 hover:bg-cyan-500"
                    >
                      {t.startTraining}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto mb-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-700/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30 text-center">
            <Timer className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold font-orbitron">{timeLeft}s</div>
            <div className="text-xs text-purple-300">{t.timeLeft}</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-700/40 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/30 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-3xl font-bold font-orbitron">{score}</div>
            <div className="text-xs text-cyan-300">{t.score}</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-green-700/40 backdrop-blur-xl rounded-xl p-4 border border-green-500/30 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-3xl font-bold font-orbitron">L{level}</div>
            <div className="text-xs text-green-300">{t.level}</div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Floating level indicator top-left */}
            <div className="fixed top-6 left-6 z-50">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-mono text-cyan-200">
                <div className="font-bold">Float</div>
                <div>
                  {velocity.y > 0.5 ? (
                    <span className="text-yellow-300">Sinking</span>
                  ) : velocity.y < -0.5 ? (
                    <span className="text-blue-300">Too High</span>
                  ) : (
                    <span className="text-green-300">Perfect</span>
                  )}
                </div>
              </div>
            </div>

            {/* On-screen control bars removed — use keyboard only */}
            <div
              className="fixed inset-0 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(100, 200, 255, 0.06) 0%, rgba(0, 120, 200, 0.12) 100%)",
                border: "3px solid rgba(100, 200, 255, 0.18)",
              }}
            >
              {/* Game background image (place your image at /public/nbl-bg.jpg) */}
              <div className="absolute inset-0 z-0">
                <Image src="/nbl-bg.jpg" alt="NBL background" fill className="object-cover object-center" priority />
                {/* subtle overlay for contrast */}
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Obstacles are now handled by the physics system */}

              <div
                className="absolute transition-all duration-100 ease-out"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 60,
                }}
              >
                <div className="relative transform scale-125">
                  <Image
                    src="/ast2.png"
                    alt="Astronaut"
                    width={170}
                    height={170}
                    className="drop-shadow-2xl"
                    priority
                  />
                  {/* Floating indicator */}
                  <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-mono">
                    <div className="text-cyan-400">
                      {velocity.y > 0 ? '↓ Sinking' : velocity.y < 0 ? '↑ Rising' : '― Stable'}
                    </div>
                  </div>
                  {/* Water particles */}
                  {isComplete && gameStarted && (
                    <>
                      <div className="absolute -top-4 -right-2 text-2xl animate-float-up opacity-70">💧</div>
                      <div className="absolute -top-8 left-2 text-xl animate-float-up-delayed opacity-60">💧</div>
                      <div className="absolute -bottom-2 -left-4 text-lg animate-float-up opacity-50">💧</div>
                    </>
                  )}
                </div>
              </div>

              <div
                className={`absolute ${isRTL ? "right-4" : "left-4"} top-0 h-full flex flex-col justify-between py-8 text-sm text-cyan-300/60 font-mono z-10`}
              >
                <span>0m</span>
                <span>5m</span>
                <span>10m</span>
                <span>15m</span>
                <span>20m</span>
              </div>

              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                  <div className="text-2xl font-bold font-orbitron mb-1">
                    {phases[phaseIndex].title}
                  </div>
                  <div className="text-cyan-400 text-sm">
                    {phases[phaseIndex].subtitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Obstacles visuals removed (logic still runs in physics) */}

            {/* Render tools (spawn across mixed phases) */}
            {tools.map((tool, index) => !tool.collected && (
              <div
                key={`tool-${index}`}
                className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${tool.x}%`,
                  top: `${tool.y}%`,
                }}
              >
                <div className="animate-pulse">
                  🔧
                </div>
              </div>
            ))}

            {/* Level completion message */}
            {showLevelComplete && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black/80 backdrop-blur-md rounded-xl p-8 text-center transform scale-up-center">
                  <>
                    <h2 className="text-3xl font-bold mb-4 text-cyan-400">{phases[phaseIndex].title} Complete!</h2>
                    <p className="text-lg text-white">{phases[phaseIndex].subtitle}</p>
                  </>
                </div>
              </div>
            )}

            {/* Phase message overlay (transient) */}
            {showPhaseMessage && (
              <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black/80 text-white rounded-xl px-6 py-3 font-bold">
                  {phases[phaseIndex].title}
                </div>
              </div>
            )}
            
            {/* Controls Guide */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white text-center">
              <div className="font-bold mb-2">Controls</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>W - Thrust Up</div>
                <div>A - Left</div>
                <div>D - Right</div>
              </div>
            </div>

            {!gameStarted && (
              <Button
                onClick={startGame}
                size="lg"
                className="w-full mt-6 h-16 text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 font-bold shadow-lg font-orbitron"
              >
                {timeLeft === 45 ? t.startTraining : t.tryAgain}
              </Button>
            )}

            {/* training fact moved down to bottom area */}

            {/* Continue to Cupola button — always visible and fixed at bottom; still disabled until enough points */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg">
              <div className="mb-3 bg-cyan-900/20 border border-cyan-700/50 rounded-xl p-4 text-center backdrop-blur-sm text-cyan-100">
                <div className="text-4xl">💡</div>
                <p className="text-lg mt-2">{t.trainingFact}</p>
              </div>

              <Button
                onClick={() => {
                  const finalScore = Math.min(score, 50)
                  const currentScore = Number.parseInt(sessionStorage.getItem("totalScore") || "0")
                  sessionStorage.setItem("totalScore", String(Math.min(currentScore + finalScore, 100)))
                  router.push("/cupola")
                }}
                disabled={score < 30}
                size="lg"
                className="w-full h-16 text-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg font-orbitron"
              >
                {score >= 30 ? (
                  <>
                    {t.continueToCupola}
                    <ArrowRight className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-6 w-6`} />
                  </>
                ) : (
                  t.scoreMorePoints.replace("{points}", String(30 - score))
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    
      {/* Scoped styles for dynamic backgrounds and asteroid layers */}
      <style jsx global>{`
  /* Use one provided background image (place your image at /public/nbl-bg.jpg) */
  /* Use static background (animations disabled) */
  .game-back.back1 { background-image: url('/nbl-bg.jpg'); background-size: cover; background-position: center; opacity: 0.98; animation: none !important; }
  .game-back.back2 { background-image: url('/nbl-bg.jpg'); background-size: cover; background-position: center; opacity: 0.7; animation: none !important; transform: scale(1.03) rotate(0.01deg); }

  /* Disable particle/asteroid movement if present */
  .ast-layer .ast { position: absolute; display: block; background: radial-gradient(circle at 30% 30%, #fff 0%, #9fe1ff 30%, transparent 60%); border-radius: 50%; opacity: 0.9; transform: translateX(0); animation: none !important; }
  .ast-layer .ast.small { opacity: 0.8; filter: blur(0.2px); }

  /* Turn off utility animations used on some elements */
  .animate-shimmer, .animate-pulse, .astronaut-bob, .animate-float-up, .animate-float-up-delayed, .animate-cupola-enter { animation: none !important; }
      `}</style>
    </main>
  )
}
