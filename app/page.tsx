"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { BackgroundMusic } from "@/components/background-music"
import { AnimatedStars } from "@/components/animated-stars"

import { ProgressBar } from "@/components/progress-bar"
import { JourneyTimeline } from "@/components/journey-timeline"
import { translations, type Language } from "@/lib/translations"

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    // country removed
    language: "en" as Language,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const t = translations[formData.language]
  const isRTL = formData.language === "ar"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.age) {
      sessionStorage.setItem("userData", JSON.stringify(formData))
      sessionStorage.setItem("totalScore", "0")
      setIsSubmitting(true)

      setTimeout(() => {
        router.push("/nbl-training")
      }, 3000)
    }
  }

  if (isSubmitting) {
    return <ProgressBar />
  }

  const timelineSteps = [
    { title: t.step1, description: t.step1Desc, completed: false },
    { title: t.step2, description: t.step2Desc, completed: false },
    { title: t.step3, description: t.step3Desc, completed: false },
    { title: t.step4, description: t.step4Desc, completed: false },
    { title: t.step5, description: t.step5Desc, completed: false },
    { title: t.step6, description: t.step6Desc, completed: false },
  ]

  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#000000] font-space-grotesk ${isRTL ? "rtl" : "ltr"}`}>
      <BackgroundMusic />
      <AnimatedStars />


      {/*
        High-quality background image.
        Drop your high-resolution image at: /public/iss-bg.jpg
        The Image component will render it with high quality (priority, quality=100).
      */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/iss-bg.jpg"
          alt="International Space Station background"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover" }}
          className="pointer-events-none"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-[#000814]/30 to-transparent z-0" />

      <div
        className={`relative z-10 flex min-h-screen items-center ${isRTL ? "justify-end" : "justify-start"} px-8 md:px-16 lg:px-24`}
      >
        <div className="max-w-2xl space-y-8 animate-fade-in">
          <div
            className={`flex gap-8 text-xs font-mono text-cyan-400/90 tracking-wider ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white font-orbitron">25</span>
              <span className="text-[10px] text-cyan-400/70">{t.years}</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white font-orbitron">16</span>
              <span className="text-[10px] text-cyan-400/70">{t.sunsetsDaily}</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white font-orbitron">3.5M</span>
              <span className="text-[10px] text-cyan-400/70">{t.photos}</span>
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-8xl md:text-9xl font-bold text-white tracking-tighter leading-none font-orbitron">
              {t.mission25}
            </h1>
            <p className="text-2xl md:text-3xl text-slate-200 leading-relaxed text-balance font-light">
              {t.startJourney} <span className="text-white font-medium">{t.iss}</span>
            </p>
          </div>

          <JourneyTimeline steps={timelineSteps} currentStep={0} language={formData.language} />

          <form onSubmit={handleSubmit} className="space-y-5 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder={t.fullName}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-md text-base hover:bg-white/10 transition-colors focus:bg-white/10"
              />
              <Input
                type="number"
                placeholder={t.age}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="1"
                max="120"
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-md text-base hover:bg-white/10 transition-colors focus:bg-white/10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div />
              <Select
                value={formData.language}
                onValueChange={(value) => {
                  setFormData({ ...formData, language: value as Language })
                  try {
                    sessionStorage.setItem("language", String(value))
                    window.dispatchEvent(new CustomEvent("language-change", { detail: String(value) }))
                  } catch {}
                }}
              >
                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-md text-base hover:bg-white/10 transition-colors">
                  <SelectValue placeholder={t.language} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-16 px-20 text-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 border border-cyan-400/20 font-orbitron"
          >
          {t.initiateMission}
        </Button>
          </form>

          <div className={`pt-8 text-xs text-slate-400 font-mono space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
            <p className="text-cyan-400/80 font-semibold tracking-wider font-orbitron">{t.teamZeroG}</p>
            <p className="text-[10px] text-slate-500">{t.issChallenge}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
