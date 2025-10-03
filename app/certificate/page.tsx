"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Share2, Rocket, Award, CheckCircle } from "lucide-react"
import { SpaceBackground3D } from "@/components/space-background-3d"

export default function CertificatePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; language: string } | null>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    } else {
      router.push("/")
    }
  }, [router])

  const handleDownload = () => {
    alert("Certificate download functionality would be implemented here using html2canvas and jsPDF libraries.")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Junior Astronaut Explorer Certificate",
          text: `I completed the Mission 25 ISS Experience!`,
        })
        .catch((err) => console.log("Error sharing:", err))
    } else {
      alert("Sharing is not supported on this browser")
    }
  }

  if (!userData) return null

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      <SpaceBackground3D />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div
            ref={certificateRef}
            className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-8 border-double border-yellow-500/70 rounded-2xl p-12 md:p-16 shadow-2xl shadow-blue-500/20 overflow-hidden"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-yellow-500/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-yellow-500/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-yellow-500/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-yellow-500/50 rounded-br-2xl" />

            {/* Header */}
            <div className="text-center space-y-6 mb-12">
              <div className="flex justify-center items-center gap-6">
                <Rocket className="h-16 w-16 text-blue-400" />
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
                    MISSION 25
                  </h1>
                  <p className="text-sm md:text-base text-blue-300 tracking-widest mt-2">INTERNATIONAL SPACE STATION</p>
                </div>
                <Award className="h-16 w-16 text-yellow-400" />
              </div>

              <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

              <p className="text-2xl font-light text-blue-200 tracking-wide">CERTIFICATE OF ACHIEVEMENT</p>
            </div>

            {/* Main content */}
            <div className="text-center space-y-8 py-8">
              <p className="text-lg text-blue-300 font-light tracking-wide">THIS CERTIFIES THAT</p>

              <div className="relative py-6">
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-wide">{userData.name}</h2>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              </div>

              <p className="text-lg md:text-xl text-blue-200 leading-relaxed max-w-3xl mx-auto font-light">
                Has successfully completed the Mission 25 journey through the International Space Station, demonstrating
                exceptional understanding of space exploration and its benefits to humanity
              </p>

              {/* Achievement badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 max-w-3xl mx-auto">
                <div className="flex flex-col items-center gap-3 p-6 bg-blue-950/40 rounded-xl border border-blue-500/30">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <p className="font-semibold text-lg">NBL Training</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 bg-blue-950/40 rounded-xl border border-blue-500/30">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <p className="font-semibold text-lg">Cupola Observation</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 bg-blue-950/40 rounded-xl border border-blue-500/30">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <p className="font-semibold text-lg">Knowledge Quiz</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-12 border-t-2 border-blue-500/30 gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-blue-400 mb-1">Date Completed</p>
                <p className="font-semibold text-lg">{currentDate}</p>
              </div>

              <div className="text-center">
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full">
                  <p className="text-xl font-bold text-slate-900">JUNIOR ASTRONAUT EXPLORER</p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-blue-400 mb-1">Team</p>
                <p className="font-semibold text-lg">Zero-G</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownload}
              size="lg"
              className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            >
              <Download className="mr-2 h-6 w-6" />
              Download Certificate
            </Button>
            <Button
              onClick={handleShare}
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-950/50 bg-transparent"
            >
              <Share2 className="mr-2 h-6 w-6" />
              Share Achievement
            </Button>
          </div>

          {/* Back to Start */}
          <div className="text-center pt-8">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-blue-300 hover:text-blue-100 text-lg"
            >
              Start New Journey
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
