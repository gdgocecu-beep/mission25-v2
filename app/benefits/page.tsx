"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Share2, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Video {
  id: number
  title: string
  description: string
  impact: string
  videoUrl: string
  embedUrl?: string
  likes: number
  comments: number
  saves: number
  shares: number
}

const defaultVideos: Video[] = [

  {
    id: 6,
    title: "Scott Kelly: A Year in Space and the Limits of Human Endurance - Zero-G",
    description: "Short: space highlights (EN)",
    impact: "Micro-moments from orbit",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl:
      "https://www.youtube.com/embed/4TOPmxoSGk8?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=4TOPmxoSGk8",
    likes: 3200,
    comments: 45,
    saves: 120,
    shares: 30,
  },
  {
    id: 7,
    title: "Fire in Space: What Happens When Gravity Disappears? - Zero-G",
    description: "Short: astronaut moments (EN)",
    impact: "Inspiring glimpses",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl:
      "https://www.youtube.com/embed/GtK0SevWnbM?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=GtK0SevWnbM",
    likes: 4100,
    comments: 82,
    saves: 210,
    shares: 56,
  },
  {
    id: 8,
    title: "Secrets Above the Storms: What We Never See - Zero G",
    description: "Short: Earth from space (EN)",
    impact: "Planetary perspective",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl:
      "https://www.youtube.com/embed/bnNZ6QrTGBw?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=bnNZ6QrTGBw",
    likes: 2800,
    comments: 60,
    saves: 98,
    shares: 20,
  },
    {
    id: 9,
    title: "من الفضاء: أسرار الأرض التي تكشفها ناسا - zero - g",
    description: "Short: Earth from space (EN)",
    impact: "Planetary perspective",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl:
      "https://www.youtube.com/embed/Cy1vueAtA3k?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=Cy1vueAtA3k",
    likes: 2800,
    comments: 60,
    saves: 98,
    shares: 20,
  },
]

const arabicVideos: Video[] = [
  {
    id: 100,
    title: "Arabic Short 1",
    description: "Short (AR)",
    impact: "",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl: "https://www.youtube.com/embed/YUxVBZfRm_c?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=YUxVBZfRm_c",
    likes: 120,
    comments: 5,
    saves: 10,
    shares: 2,
  },
  {
    id: 101,
    title: "Arabic Short 2",
    description: "Short (AR)",
    impact: "",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl: "https://www.youtube.com/embed/h0Rt4dQyeZg?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=h0Rt4dQyeZg",
    likes: 95,
    comments: 3,
    saves: 6,
    shares: 1,
  },
  {
    id: 102,
    title: "Arabic Short 3",
    description: "Short (AR)",
    impact: "",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl: "https://www.youtube.com/embed/10gUC4f-vHQ?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=10gUC4f-vHQ",
    likes: 140,
    comments: 8,
    saves: 18,
    shares: 4,
  },
  {
    id: 103,
    title: "Arabic Short 4",
    description: "Short (AR)",
    impact: "",
    videoUrl: "/nbl-astronaut.jpg",
    embedUrl: "https://www.youtube.com/embed/qyOjqI4lYSs?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=qyOjqI4lYSs",
    likes: 78,
    comments: 2,
    saves: 5,
    shares: 0,
  },
]

export default function BenefitsPage() {
  const router = useRouter()
  const [playerReady, setPlayerReady] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videos, setVideos] = useState<Video[]>(defaultVideos)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userLiked, setUserLiked] = useState<Record<number, boolean>>({})
  const [userSaved, setUserSaved] = useState<Record<number, boolean>>({})
  const [videoStats, setVideoStats] = useState<Record<number, Video>>(
    defaultVideos.reduce((acc: Record<number, Video>, v) => ({ ...acc, [v.id]: v }), {}),
  )
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<any>(null)
  const currentVideo = videoStats[videos[currentIndex]?.id] || videos[currentIndex]

  // show a simple hero with two large choices (AstroTok / AstroRead)
  const [showChoices, setShowChoices] = useState(true)

  // safety: if mapping isn't ready or index is out of range, show a fallback
  if (!currentVideo) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  const getEmbedSrc = (url?: string) => {
    if (!url) return undefined
    if (url.includes("enablejsapi=1")) return url
    return url + (url.includes("?") ? "&enablejsapi=1" : "?enablejsapi=1")
  }

  const extractYouTubeId = (url?: string) => {
    if (!url) return null
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/embed\/([^?&]+)/)
    return m ? m[1] : null
  }

  useEffect(() => {
    audioRef.current = new Audio("/space-ambient.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    if (!isMuted) {
      audioRef.current.play().catch(() => {})
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // sync videos to the app language (sessionStorage + custom events)
  useEffect(() => {
    const applyLang = (lang?: string | null) => {
      const isAr = lang === "ar" || lang === "Arabic"
      if (isAr) {
        setVideos(arabicVideos)
        setVideoStats(arabicVideos.reduce((acc: Record<number, Video>, v) => ({ ...acc, [v.id]: v }), {}))
        setCurrentIndex(0)
      } else {
        setVideos(defaultVideos)
        setVideoStats(defaultVideos.reduce((acc: Record<number, Video>, v) => ({ ...acc, [v.id]: v }), {}))
        setCurrentIndex(0)
      }
    }

    try {
      const langKey = sessionStorage.getItem("language")
      applyLang(langKey)
    } catch {}

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail
      applyLang(detail)
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "language") applyLang(e.newValue)
    }

    window.addEventListener("language-change", onCustom as EventListener)
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener("language-change", onCustom as EventListener)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  // YouTube Player API loader
  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve()
      const w = window as any
      if (w.YT && w.YT.Player) return resolve()
      const existing = document.getElementById("youtube-api")
      if (existing) {
        existing.addEventListener("load", () => resolve())
        return
      }
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      tag.id = "youtube-api"
      tag.onload = () => resolve()
      document.body.appendChild(tag)
    })
  }

  // control the embedded YouTube player's playback and mute state
  useEffect(() => {
    // only act for YouTube embeds
    if (!currentVideo || !currentVideo.embedUrl) return
    if (!currentVideo.embedUrl.includes("youtube.com/embed")) return

    let mounted = true

    loadYouTubeAPI().then(() => {
      if (!mounted) return
      const w = window as any
      const playerId = `yt-player`

      // create player if not exists
      try {
        if (!playerRef.current) {
          playerRef.current = new w.YT.Player(playerId, {
            events: {
              onReady: (e: any) => {
                // mark player ready
                setPlayerReady(true)
                // on ready, load the current video id if available
                const vid = extractYouTubeId(currentVideo.embedUrl)
                if (vid) {
                  try { e.target.loadVideoById(vid) } catch {}
                }
                if (!isMuted) {
                  try { e.target.unMute && e.target.unMute(); e.target.playVideo && e.target.playVideo() } catch {}
                } else {
                  try { e.target.mute && e.target.mute() } catch {}
                }
              },
            },
          })
        } else {
          const p = playerRef.current
          const vid = extractYouTubeId(currentVideo.embedUrl)
          try {
            if (vid) {
              // load the specific video into the existing player
              p.loadVideoById && p.loadVideoById(vid)
            }
            // when reloading, the player is effectively ready
            setPlayerReady(true)
            if (currentVideo.id === 6 && !isMuted) {
              p.unMute && p.unMute()
              p.playVideo && p.playVideo()
            } else if (currentVideo.id === 6 && isMuted) {
              p.mute && p.mute()
            } else {
              p.pauseVideo && p.pauseVideo()
            }
          } catch {}
        }
      } catch (err) {
        // ignore player creation errors
      }
    })

    return () => {
      mounted = false
      try {
        if (playerRef.current && playerRef.current.pauseVideo) {
          playerRef.current.pauseVideo()
        }
      } catch {}
    }
  }, [currentIndex, isMuted, currentVideo])

  // Best-effort: try to unmute/play immediately and also on the first user gesture
  useEffect(() => {
    if (!currentVideo || !currentVideo.embedUrl) return
    if (!currentVideo.embedUrl.includes("youtube.com/embed")) return

    const tryUnmutePlay = () => {
      const p = playerRef.current
      if (p) {
        try {
          p.unMute && p.unMute()
          p.playVideo && p.playVideo()
          setIsMuted(false)
        } catch {}
      }
    }

    // attempt right away
    tryUnmutePlay()

    // if blocked, the first user gesture will count — add one-time listeners
    const onFirstGesture = () => {
      tryUnmutePlay()
      document.removeEventListener("click", onFirstGesture)
      document.removeEventListener("touchstart", onFirstGesture)
    }

    document.addEventListener("click", onFirstGesture)
    document.addEventListener("touchstart", onFirstGesture)

    return () => {
      document.removeEventListener("click", onFirstGesture)
      document.removeEventListener("touchstart", onFirstGesture)
    }
  }, [currentIndex])

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [isMuted])

  const enableVideoSound = () => {
    // Ensure the YouTube iframe API is loaded and a player exists that we can unmute/play.
    try {
      loadYouTubeAPI().then(() => {
        try {
          const w = (window as any)
          // If our playerRef isn't set, try to create it (YT will attach to iframe id=yt-player)
          if (!playerRef.current && w.YT && w.YT.Player) {
            try {
              playerRef.current = new w.YT.Player('yt-player')
            } catch {}
          }

          const p = playerRef.current
          if (p) {
            p.unMute && p.unMute()
            p.playVideo && p.playVideo()
          }
        } catch {}
        setIsMuted(false)
        setPlayerReady(true)
      })
    } catch {}
  }

    // Toggle play/pause for the YouTube player
    const togglePlay = () => {
      try {
        const p = playerRef.current
        if (p) {
          if (isPlaying) {
            p.pauseVideo && p.pauseVideo()
            setIsPlaying(false)
          } else {
            p.playVideo && p.playVideo()
            setIsPlaying(true)
          }
          return
        }

        // If player isn't created yet, create it and play
        loadYouTubeAPI().then(() => {
          const w = (window as any)
          if (!playerRef.current && w.YT && w.YT.Player) {
            try {
              playerRef.current = new w.YT.Player('yt-player')
            } catch {}
          }
          const p2 = playerRef.current
          p2 && p2.playVideo && p2.playVideo()
          setIsPlaying(true)
        })
      } catch {}
    }

    useEffect(() => {
      // assume autoplay when switching videos
      setIsPlaying(true)
    }, [currentIndex])

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= videos.length || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (isTransitioning) return

    if (e.deltaY > 0 && currentIndex < videos.length - 1) {
      scrollToIndex(currentIndex + 1)
    } else if (e.deltaY < 0 && currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < videos.length - 1) {
        scrollToIndex(currentIndex + 1)
      } else if (diff < 0 && currentIndex > 0) {
        scrollToIndex(currentIndex - 1)
      }
    }
  }

  const handleLike = (id: number) => {
    setUserLiked((prev) => {
      const newLiked = { ...prev, [id]: !prev[id] }
      setVideoStats((prevStats) => ({
        ...prevStats,
        [id]: {
          ...prevStats[id],
          likes: prevStats[id].likes + (newLiked[id] ? 1 : -1),
        },
      }))
      return newLiked
    })
  }

  const handleSave = (id: number) => {
    setUserSaved((prev) => {
      const newSaved = { ...prev, [id]: !prev[id] }
      setVideoStats((prevStats) => ({
        ...prevStats,
        [id]: {
          ...prevStats[id],
          saves: prevStats[id].saves + (newSaved[id] ? 1 : -1),
        },
      }))
      return newSaved
    })
  }

  const shareVideo = async (v: Video) => {
    const url = v.embedUrl || window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: v.title, text: v.description, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard')
      } else {
        prompt('Copy this link', url)
      }
    } catch (e) {
      console.warn('Share failed', e)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [currentIndex, isTransitioning])


  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <main ref={containerRef} className="h-screen w-screen overflow-hidden bg-black relative">
      <iframe
        id={`yt-player`}
        src={getEmbedSrc(currentVideo.embedUrl)}
        title={currentVideo.title}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />

      {/* transparent overlay to capture wheel/touch over the iframe so scrolling moves videos */}
      <div
        className="absolute inset-0 z-20"
        onWheel={(e) => {
          e.preventDefault()
          if (isTransitioning) return
          if (e.deltaY > 0 && currentIndex < videos.length - 1) scrollToIndex(currentIndex + 1)
          else if (e.deltaY < 0 && currentIndex > 0) scrollToIndex(currentIndex - 1)
        }}
        onTouchStart={(e) => {
          // forward to touch handlers
          touchStartY.current = e.touches[0].clientY
        }}
        onTouchEnd={(e) => {
          const touchEndY = e.changedTouches[0].clientY
          const diff = touchStartY.current - touchEndY
          if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < videos.length - 1) scrollToIndex(currentIndex + 1)
            else if (diff < 0 && currentIndex > 0) scrollToIndex(currentIndex - 1)
          }
        }}
        style={{ background: 'transparent' }}
      />

      {/* right-side action buttons: like, comment, save, share */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 z-30">
        {/* sound toggle */}
        <button
          onClick={() => {
            if (isMuted) {
              enableVideoSound()
            } else {
              try {
                const p = playerRef.current
                p && p.mute && p.mute()
              } catch {}
              setIsMuted(true)
            }
          }}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95"
          aria-label="Toggle sound"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
          </div>
          <span className="text-xs text-white">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>

        {/* play/pause toggle */}
        <button
          onClick={togglePlay}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95"
          aria-label="Play/Pause"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xl text-white">{isPlaying ? '⏸' : '▶'}</span>
          </div>
          <span className="text-xs text-white">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={() => handleLike(currentVideo.id)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95"
          aria-label="Like"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${userLiked[currentVideo.id] ? 'bg-red-500/40' : 'bg-white/20'}`}>
            <Heart className={`h-7 w-7 ${userLiked[currentVideo.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </div>
          <span className="text-xs text-white">{formatNumber(currentVideo.likes)}</span>
        </button>

        <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95" aria-label="Comments">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-white">{formatNumber(currentVideo.comments)}</span>
        </button>

        <button onClick={() => handleSave(currentVideo.id)} className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95" aria-label="Save">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${userSaved[currentVideo.id] ? 'bg-yellow-500/40' : 'bg-white/20'}`}>
            <Bookmark className={`h-6 w-6 ${userSaved[currentVideo.id] ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} />
          </div>
          <span className="text-xs text-white">{formatNumber(currentVideo.saves)}</span>
        </button>

        <button onClick={() => shareVideo(currentVideo)} className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95" aria-label="Share">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs text-white">Share</span>
        </button>
      </div>

      {/* up/down scroll buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-30">
        <button
          onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
          aria-label="Previous video"
        >
          ▲
        </button>
        <button
          onClick={() => scrollToIndex(Math.min(videos.length - 1, currentIndex + 1))}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
          aria-label="Next video"
        >
          ▼
        </button>
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-white" : "w-1 bg-white/40"}`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>

      {currentIndex === videos.length - 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
          <Button
            onClick={() => router.push('/quiz')}
            size="lg"
            className="px-8 py-3 bg-white text-black font-bold rounded-full"
          >
            Take the Quiz
          </Button>
        </div>
      )}
    </main>
  )
}
