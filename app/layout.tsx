import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
import { Noto_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AstronautAssistant from "@/components/astronaut-assistant"
import LanguageProvider from "@/components/language-provider"
import { MissionProgress } from "@/components/mission-progress"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mission 25 - ISS Experience",
  description: "Interactive journey through the International Space Station",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${orbitron.variable} ${spaceGrotesk.variable} ${notoArabic.variable} antialiased`}>
        <LanguageProvider />
        <Suspense fallback={<div>Loading...</div>}>
          <AstronautAssistant />
          <MissionProgress />
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
