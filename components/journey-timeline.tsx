"use client"

import { CheckCircle2, Circle } from "lucide-react"

interface TimelineStep {
  title: string
  description: string
  completed: boolean
}

interface JourneyTimelineProps {
  steps: TimelineStep[]
  currentStep: number
  language: string
}

export function JourneyTimeline({ steps, currentStep, language }: JourneyTimelineProps) {
  const isRTL = language === "ar"

  return (
    <div className={`w-full py-12 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/40 to-purple-500/20" />

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep

              return (
                <div key={index} className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
                        : isCurrent
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 animate-pulse"
                          : "bg-slate-800/50 border-2 border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : (
                      <Circle className={`w-8 h-8 ${isCurrent ? "text-white" : "text-slate-600"}`} />
                    )}
                  </div>

                  {/* Text */}
                  <h3
                    className={`text-sm font-bold mb-1 font-orbitron ${
                      isCompleted || isCurrent ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className={`text-xs ${isCompleted || isCurrent ? "text-slate-300" : "text-slate-600"}`}>
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
