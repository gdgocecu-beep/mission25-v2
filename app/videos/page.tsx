"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Share2, Play, Pause } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

interface Video {
  id: number
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  thumbnail: string
  likes: string
  comments: string
  saves: string
  shares: string
}

const videos: Video[] = [
  {
    id: 1,
    title: "Life Aboard the ISS",
    titleAr: "الحياة على متن محطة الفضاء الدولية",
    description: "Experience daily routines of astronauts in microgravity",
    descriptionAr: "اختبر الروتين اليومي لرواد الفضاء في الجاذبية الصغرى",
    thumbnail: "/astronaut-floating-inside-iss-module.jpg",
    likes: "20.5K",
    comments: "228",
    saves: "1.2K",
    shares: "490",
  },
  {
    id: 2,
    title: "Earth from the Cupola",
    titleAr: "الأرض من كوبولا",
    description: "Breathtaking views of our planet from space",
    descriptionAr: "مناظر خلابة لكوكبنا من الفضاء",
    thumbnail: "/stunning-earth-view-from-iss-cupola-window.jpg",
    likes: "45.2K",
    comments: "512",
    saves: "3.4K",
    shares: "890",
  },
  {
    id: 3,
    title: "Spacewalk Training",
    titleAr: "تدريب السير في الفضاء",
    description: "Watch astronauts prepare for EVA missions",
    descriptionAr: "شاهد رواد الفضاء يستعدون لمهام السير في الفضاء",
    thumbnail: "/astronaut-in-spacesuit-during-spacewalk-with-earth.jpg",
    likes: "32.8K",
    comments: "345",
    saves: "2.1K",
    shares: "670",
  },
  {
    id: 4,
    title: "Science Experiments",
    titleAr: "التجارب العلمية",
    description: "Discover groundbreaking research in orbit",
    descriptionAr: "اكتشف الأبحاث الرائدة في المدار",
    thumbnail: "/astronaut-conducting-science-experiment-in-iss-lab.jpg",
    likes: "18.9K",
    comments: "189",
    saves: "980",
    shares: "340",
  },
]

export default function VideosPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; language: string } | null>(null)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set())
  const [savedVideos, setSavedVideos] = useState<Set<number>>(new Set())

  const language = (userData?.language === "Arabic" ? "ar" : "en") as Language
  const t = translations[language]
  const isRTL = language === "ar"

  useEffect(() => {
    const data = sessionStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    } else {
      router.push("/")
    }
  }, [router])

  const handleLike = (videoId: number) => {
    setLikedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const handleSave = (videoId: number) => {
    setSavedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1)
      setIsPlaying(false)
    } else if (e.deltaY < 0 && currentVideo > 0) {
      setCurrentVideo(currentVideo - 1)
      setIsPlaying(false)
    }
  }

  if (!userData) return null

  const video = videos[currentVideo]

  return (
    <main
      className={`h-screen overflow-hidden bg-black text-white relative font-space-grotesk ${isRTL ? "rtl" : "ltr"}`}
      onWheel={handleScroll}
    >
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="relative w-full max-w-[500px] h-full bg-gradient-to-b from-slate-900 to-black">
          {/* Video/Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${video.thumbnail})`,
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          </div>

          {/* Play/Pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
            >
              {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1" />}
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h2 className="text-2xl font-bold mb-2 font-orbitron">{language === "ar" ? video.titleAr : video.title}</h2>
            <p className="text-sm text-slate-300 mb-4">{language === "ar" ? video.descriptionAr : video.description}</p>

            <Button
              onClick={() => router.push("/quiz")}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold font-orbitron"
            >
              Continue to Quiz
            </Button>
          </div>

          <div className={`absolute bottom-32 ${isRTL ? "left-4" : "right-4"} flex flex-col gap-6 z-20`}>
            {/* Like */}
            <button onClick={() => handleLike(video.id)} className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <Heart
                  className={`w-7 h-7 ${likedVideos.has(video.id) ? "fill-red-500 text-red-500" : "text-white"} group-hover:scale-110 transition-transform`}
                />
              </div>
              <span className="text-xs font-bold text-white">{video.likes}</span>
            </button>

            {/* Comment */}
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white">{video.comments}</span>
            </button>

            {/* Save */}
            <button onClick={() => handleSave(video.id)} className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <Bookmark
                  className={`w-7 h-7 ${savedVideos.has(video.id) ? "fill-yellow-500 text-yellow-500" : "text-white"} group-hover:scale-110 transition-transform`}
                />
              </div>
              <span className="text-xs font-bold text-white">{video.saves}</span>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <Share2 className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white">{video.shares}</span>
            </button>
          </div>

          {/* Video progress indicator */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${index === currentVideo ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
