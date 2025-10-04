"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

type GameStage = "gravity" | "collect" | "repair" | "victory" | "gameover"

interface Tool {
  x: number
  y: number
  collected: boolean
  type: string
}

interface Fish {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  flipX: boolean
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const backgroundMusicRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const [stage, setStage] = useState<GameStage>("gravity")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [toolsCollected, setToolsCollected] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [oxygen, setOxygen] = useState(100)

  const gameStateRef = useRef({
    player: { x: 300, y: 300, vx: 0, vy: 0, moving: false, size: 220 },
    keys: {} as Record<string, boolean>,
    tools: [] as Tool[],
    fish: [] as Fish[], // Changed from obstacles to fish
    astronautStatic: null as HTMLImageElement | null,
    astronautMoving: null as HTMLImageElement | null,
    backgroundBroken: null as HTMLImageElement | null,
    backgroundFixed: null as HTMLImageElement | null,
    imagesLoaded: false,
    gravityTimer: 0,
    shipRepaired: false,
    currentDriftX: 0,
    currentDriftY: 0,
    collectionCooldown: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const loadImages = () => {
      const astStatic = new Image()
      const astMoving = new Image()
      const bgBroken = new Image()
      const bgFixed = new Image()

      let loadedCount = 0
      const checkAllLoaded = () => {
        loadedCount++
        if (loadedCount === 4) {
          gameStateRef.current.imagesLoaded = true
        }
      }

      astStatic.onload = checkAllLoaded
      astMoving.onload = checkAllLoaded
      bgBroken.onload = checkAllLoaded
      bgFixed.onload = checkAllLoaded

      astStatic.src = "/images/ast1.png"
      astMoving.src = "/images/ast2.png"
      bgBroken.src = "/images/back2.png"
      bgFixed.src = "/images/back1.png"

      gameStateRef.current.astronautStatic = astStatic
      gameStateRef.current.astronautMoving = astMoving
      gameStateRef.current.backgroundBroken = bgBroken
      gameStateRef.current.backgroundFixed = bgFixed
    }
    loadImages()

    if (gameStateRef.current.tools.length === 0) {
      const padding = 100 // Padding from edges
      const maxX = Math.max(1400, window.innerWidth - padding)
      const maxY = Math.max(600, window.innerHeight - padding)

      gameStateRef.current.tools = [
        { x: padding + 150, y: padding, collected: false, type: "🔧" },
        { x: padding + 500, y: maxY - 100, collected: false, type: "🔨" },
        { x: maxX - 400, y: padding + 50, collected: false, type: "⚙️" },
        { x: maxX - 100, y: maxY - 150, collected: false, type: "🔩" },
        { x: padding + 700, y: maxY / 2, collected: false, type: "🛠️" },
        { x: padding + 300, y: maxY - 50, collected: false, type: "🔌" },
        { x: maxX - 300, y: padding, collected: false, type: "⚡" },
        { x: maxX, y: maxY / 2 - 50, collected: false, type: "🪛" },
      ]
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key.toLowerCase()] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    const startBackgroundMusic = () => {
      if (!soundEnabled) return
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = audioContext

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 220
        oscillator.type = "sine"
        gainNode.gain.value = 0.08

        oscillator.start()
        backgroundMusicRef.current = oscillator
        gainNodeRef.current = gainNode

        const lfo = audioContext.createOscillator()
        const lfoGain = audioContext.createGain()
        lfo.frequency.value = 0.5
        lfoGain.gain.value = 10
        lfo.connect(lfoGain)
        lfoGain.connect(oscillator.frequency)
        lfo.start()
      } catch (e) {
        console.log("Audio not supported")
      }
    }

    startBackgroundMusic()

    const playSound = (frequency: number, duration: number) => {
      if (!soundEnabled) return
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (e) {
        console.log("Audio not supported")
      }
    }

    let animationFrameId: number
    let frameCount = 0
    const gameLoop = () => {
      const state = gameStateRef.current
      const { player, keys } = state
      frameCount++

      if (state.collectionCooldown > 0) {
        state.collectionCooldown--
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (state.imagesLoaded) {
        const bg = stage === "victory" || state.shipRepaired ? state.backgroundFixed : state.backgroundBroken
        if (bg) {
          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
        }
      }

      const acceleration = 0.4
      const friction = 0.95
      const maxSpeed = 6

      if (frameCount % 180 === 0) {
        state.currentDriftX = (Math.random() - 0.5) * 0.3
        state.currentDriftY = (Math.random() - 0.5) * 0.3
      }

      player.moving = false

      if (keys["arrowup"] || keys["w"]) {
        player.vy -= acceleration
        player.moving = true
      }
      if (keys["arrowdown"] || keys["s"]) {
        player.vy += acceleration
        player.moving = true
      }
      if (keys["arrowleft"] || keys["a"]) {
        player.vx -= acceleration
        player.moving = true
      }
      if (keys["arrowright"] || keys["d"]) {
        player.vx += acceleration
        player.moving = true
      }

      player.vx += state.currentDriftX
      player.vy += state.currentDriftY

      player.vx *= friction
      player.vy *= friction

      const speed = Math.sqrt(player.vx ** 2 + player.vy ** 2)
      if (speed > maxSpeed) {
        player.vx = (player.vx / speed) * maxSpeed
        player.vy = (player.vy / speed) * maxSpeed
      }

      player.x += player.vx
      player.y += player.vy

      if (player.x < 0) player.x = 0
      if (player.x > canvas.width - player.size) player.x = canvas.width - player.size
      if (player.y < 0) player.y = 0
      if (player.y > canvas.height - player.size) player.y = canvas.height - player.size

      if (state.imagesLoaded) {
        const astronaut = player.moving ? state.astronautMoving : state.astronautStatic
        if (astronaut) {
          ctx.drawImage(astronaut, player.x, player.y, player.size, player.size)
        }
      }

      if (stage === "collect" || stage === "repair") {
        if (frameCount % 60 === 0) {
          setOxygen((prev) => {
            const newOxygen = Math.max(0, prev - 0.5)
            if (newOxygen === 0 && stage !== "gameover") {
              setStage("gameover")
              playSound(200, 0.5) // Low frequency sound for game over
            }
            return newOxygen
          })
        }
      }

      if (stage === "gameover") {
        drawHUD(ctx, canvas.width, canvas.height)
        return
      }

      if (stage === "gravity") {
        state.gravityTimer++
        if (state.gravityTimer > 480) {
          setStage("collect")
          setShowInstructions(true)
          playSound(523, 0.2)
        }
      } else if (stage === "collect") {
        state.tools.forEach((tool) => {
          if (!tool.collected) {
            const pulse = Math.sin(frameCount * 0.05) * 10 + 30
            ctx.font = "50px Arial"
            ctx.fillText(tool.type, tool.x, tool.y)

            ctx.beginPath()
            ctx.arc(tool.x + 25, tool.y - 25, pulse, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(6, 182, 212, 0.3)"
            ctx.fill()

            const dx = player.x + player.size / 2 - tool.x
            const dy = player.y + player.size / 2 - tool.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 60 && state.collectionCooldown === 0) {
              tool.collected = true
              state.collectionCooldown = 15 // 15 frames cooldown (~0.25 seconds)

              const collectedCount = state.tools.filter((t) => t.collected).length
              setToolsCollected(collectedCount)

              if (collectedCount === state.tools.length) {
                setStage("repair")
                setShowInstructions(true)
              }

              playSound(659, 0.15)
              setOxygen((prev) => Math.min(100, prev + 5))
            }
          }
        })
      } else if (stage === "repair") {
        const shipX = canvas.width - 350
        const shipY = canvas.height / 2 - 150

        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 4
        ctx.setLineDash([15, 10])
        ctx.beginPath()
        ctx.roundRect(shipX, shipY, 250, 250, 20)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = "#06b6d4"
        ctx.font = "bold 24px Arial"
        ctx.fillText("REPAIR ZONE", shipX + 30, shipY - 20)

        const inZone =
          player.x + player.size > shipX &&
          player.x < shipX + 250 &&
          player.y + player.size > shipY &&
          player.y < shipY + 250

        if (inZone && !state.shipRepaired) {
          state.shipRepaired = true
          setTimeout(() => {
            setStage("victory")
            playSound(784, 0.5)
          }, 500)
        }
      }

      drawHUD(ctx, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    const drawHUD = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const progressBarWidth = 600
      const progressBarX = width / 2 - progressBarWidth / 2
      const progressBarY = 20

      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.beginPath()
      ctx.roundRect(progressBarX - 10, progressBarY - 10, progressBarWidth + 20, 70, 15)
      ctx.fill()
      ctx.strokeStyle = "#06b6d4"
      ctx.lineWidth = 2
      ctx.stroke()

      const stageCount = 6
      const circleSpacing = progressBarWidth / (stageCount - 1)
      const currentStageNum =
        stage === "gravity" ? 1 : stage === "collect" ? 2 : stage === "repair" ? 3 : stage === "victory" ? 6 : 0

      for (let i = 0; i < stageCount; i++) {
        const circleX = progressBarX + i * circleSpacing
        const circleY = progressBarY + 25

        if (i > 0) {
          ctx.strokeStyle = i < currentStageNum ? "#06b6d4" : "#475569"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(circleX - circleSpacing, circleY)
          ctx.lineTo(circleX, circleY)
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(circleX, circleY, 20, 0, Math.PI * 2)
        ctx.fillStyle = i < currentStageNum ? "#06b6d4" : "#475569"
        ctx.fill()
        ctx.strokeStyle = i === currentStageNum - 1 ? "#ffffff" : "#334155"
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.fillStyle = i < currentStageNum ? "#0f172a" : "#cbd5e1"
        ctx.font = "bold 16px Arial"
        ctx.textAlign = "center"
        ctx.fillText((i + 1).toString(), circleX, circleY + 6)
      }

      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.beginPath()
      ctx.roundRect(20, 110, 350, 100, 15)
      ctx.fill()
      ctx.strokeStyle = "#06b6d4"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#06b6d4"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "left"
      ctx.fillText("CURRENT STAGE:", 40, 140)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 24px Arial"
      const stageText =
        stage === "gravity"
          ? "01 - GRAVITY ADAPTATION"
          : stage === "collect"
            ? "02 - TOOL COLLECTION"
            : stage === "repair"
              ? "03 - SHIP REPAIR"
              : stage === "victory"
                ? "MISSION COMPLETE"
                : "GAME OVER"
      ctx.fillText(stageText, 40, 175)

      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
      ctx.beginPath()
      ctx.roundRect(20, 230, 350, 70, 15)
      ctx.fill()
      ctx.strokeStyle = oxygen > 30 ? "#06b6d4" : "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = oxygen > 30 ? "#06b6d4" : "#ef4444"
      ctx.font = "bold 18px Arial"
      ctx.fillText("OXYGEN:", 40, 260)

      const oxygenBarWidth = 200
      const oxygenBarX = 150
      const oxygenBarY = 245
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.roundRect(oxygenBarX, oxygenBarY, oxygenBarWidth, 25, 8)
      ctx.fill()
      ctx.fillStyle = oxygen > 30 ? "#10b981" : "#ef4444"
      ctx.beginPath()
      ctx.roundRect(oxygenBarX, oxygenBarY, (oxygenBarWidth * oxygen) / 100, 25, 8)
      ctx.fill()
      ctx.strokeStyle = "#475569"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(oxygenBarX, oxygenBarY, oxygenBarWidth, 25, 8)
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${Math.round(oxygen)}%`, oxygenBarX + oxygenBarWidth / 2, oxygenBarY + 18)

      if (stage === "collect" || stage === "repair") {
        const currentCollectedCount = gameStateRef.current.tools.filter((t) => t.collected).length

        ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
        ctx.beginPath()
        ctx.roundRect(20, 320, 350, 60, 15)
        ctx.fill()
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#06b6d4"
        ctx.font = "bold 20px Arial"
        ctx.textAlign = "left"
        ctx.fillText(`TOOLS: ${currentCollectedCount}/${gameStateRef.current.tools.length}`, 40, 355)
      }

      if (showInstructions) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)"
        ctx.beginPath()
        ctx.roundRect(width / 2 - 250, height - 120, 500, 90, 15)
        ctx.fill()
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 20px Arial"
        ctx.textAlign = "center"
        const instruction =
          stage === "gravity"
            ? "Use WASD or Arrow Keys to adapt to underwater movement"
            : stage === "collect"
              ? "Collect all tools scattered around the facility!"
              : stage === "repair"
                ? "Navigate to the REPAIR ZONE with your tools!"
                : ""
        ctx.fillText(instruction, width / 2, height - 70)
        ctx.textAlign = "left"
      }
    }

    gameLoop()

    const instructionTimer = setTimeout(() => {
      setShowInstructions(false)
    }, 7000)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      clearTimeout(instructionTimer)
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stage, soundEnabled, showInstructions])

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="w-full h-full" />

      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-slate-900/80 border-cyan-500/30 hover:bg-slate-800/80 hover:border-cyan-400/50 text-cyan-300 rounded-2xl"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {stage === "gameover" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-20">
          <div className="bg-gradient-to-br from-red-900/90 to-slate-900 p-12 rounded-3xl border-4 border-red-500 shadow-2xl shadow-red-500/50 text-center max-w-2xl animate-in fade-in zoom-in duration-500">
            <div className="text-8xl mb-6">💀</div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text mb-4">
              MISSION FAILED
            </h1>
            <p className="text-2xl text-red-100 mb-8">
              Oxygen depleted! You ran out of air during the training mission.
            </p>
            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="text-red-300 text-lg mb-2">Mission Summary:</div>
              <div className="text-white text-xl">
                ✗ Oxygen: 0%
                <br />
                {toolsCollected > 0
                  ? `✓ Collected ${toolsCollected}/${gameStateRef.current.tools.length} tools`
                  : "✗ No tools collected"}
                <br />✗ Mission incomplete
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold text-xl px-12 py-6 rounded-2xl"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {stage === "victory" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-3xl border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50 text-center max-w-2xl animate-in fade-in zoom-in duration-500">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-4">
              MISSION COMPLETE!
            </h1>
            <p className="text-2xl text-cyan-100 mb-8">
              Congratulations, Astronaut! You've successfully completed your NBL training.
            </p>
            <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="text-cyan-300 text-lg mb-2">Training Summary:</div>
              <div className="text-white text-xl">
                ✓ Mastered underwater movement
                <br />✓ Collected all {gameStateRef.current.tools.length} tools
                <br />✓ Repaired the spacecraft
                <br />✓ Oxygen remaining: {Math.round(oxygen)}%
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-xl px-12 py-6 rounded-2xl"
            >
              Train Again
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
