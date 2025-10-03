"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const MISSION_STEPS = [
  { path: "/nbl-training", label: "NBL Training", description: "Weightlessness simulation" },
  { path: "/cupola", label: "Cupola", description: "View Earth from space" },
  { path: "/benefits", label: "Earth Benefits", description: "Discover ISS research" },
  { path: "/videos", label: "Space Videos", description: "Watch astronauts" },
  { path: "/quiz", label: "Knowledge Quiz", description: "Test your knowledge" },
  { path: "/certificate", label: "Certificate", description: "Mission complete" },
]

export function MissionProgress() {
  const pathname = usePathname()
  
  // Find current step index
  const currentStepIndex = Math.max(
    0,
    MISSION_STEPS.findIndex((step) => step.path === pathname)
  )

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
        {MISSION_STEPS.map((step, index) => (
          <div key={step.path} className="flex items-center">
            {/* Step circle */}
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors relative group",
                index <= currentStepIndex 
                  ? "bg-cyan-500 text-white" 
                  : "bg-white/10 text-white/40"
              )}
            >
              {index + 1}
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-black/90 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                  <div className="font-bold">{step.label}</div>
                  <div className="text-cyan-400/80 text-[10px]">{step.description}</div>
                </div>
              </div>
            </div>
            {/* Connector line */}
            {index < MISSION_STEPS.length - 1 && (
              <div 
                className={cn(
                  "w-12 h-[2px] mx-1",
                  index < currentStepIndex 
                    ? "bg-cyan-500" 
                    : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}