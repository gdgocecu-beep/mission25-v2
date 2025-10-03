"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Star field
    interface Star {
      x: number
      y: number
      z: number
      size: number
      speed: number
    }

    const stars: Star[] = []
    const numStars = 200

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    // Earth properties
    let earthRotation = 0

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(10, 14, 39, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        star.z -= star.speed

        if (star.z <= 0) {
          star.z = canvas.width
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
        }

        const x = (star.x / star.z) * canvas.width + canvas.width / 2
        const y = (star.y / star.z) * canvas.height + canvas.height / 2
        const size = ((canvas.width - star.z) / canvas.width) * star.size

        ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z / canvas.width})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw Earth in corner
      const earthX = canvas.width - 150
      const earthY = canvas.height - 150
      const earthRadius = 80

      // Earth glow
      const gradient = ctx.createRadialGradient(earthX, earthY, earthRadius * 0.8, earthX, earthY, earthRadius * 1.5)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthRadius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Earth body
      const earthGradient = ctx.createRadialGradient(
        earthX - 20,
        earthY - 20,
        earthRadius * 0.3,
        earthX,
        earthY,
        earthRadius,
      )
      earthGradient.addColorStop(0, "#4a9eff")
      earthGradient.addColorStop(0.5, "#2563eb")
      earthGradient.addColorStop(1, "#1e3a8a")
      ctx.fillStyle = earthGradient
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2)
      ctx.fill()

      // Earth clouds (rotating)
      ctx.save()
      ctx.translate(earthX, earthY)
      ctx.rotate(earthRotation)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const cloudX = Math.cos(angle) * (earthRadius * 0.6)
        const cloudY = Math.sin(angle) * (earthRadius * 0.6)
        ctx.beginPath()
        ctx.arc(cloudX, cloudY, earthRadius * 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      earthRotation += 0.001

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

export default SpaceBackground3D
