"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import dynamic from 'next/dynamic'
// Lazy-load EarthGlobe to avoid increasing initial bundle size
const EarthGlobe = dynamic(() => import('@/components/earth-globe'), { ssr: false })
import { ArrowRight, Search, Loader2, MapPin, Zap } from "lucide-react"
import Image from "next/image"

interface EarthImage {
  url: string
  title: string
  year: string
  description: string
  country: string
  stats: {
    altitude: string
    speed: string
    orbit: string
    photos: string
  }
}

const countryData: Record<
  string,
  {
    name: string
    flag: string
    images: string[]
    descriptions: string[]
    years: string[]
  }
> = {
  egypt: {
    name: "Egypt",
    flag: "🇪🇬",
    images: ["/egypt-cupola.jpg"],
    descriptions: [
      "The Nile River illuminates Egypt like a golden ribbon across the desert. Cairo's bright lights mark one of Africa's largest cities. This imagery helps monitor urban expansion and agricultural patterns.",
      "Egypt's distinctive Nile Delta glows brilliantly at night. Scientists use these images to track water usage, urban growth, and light pollution effects on the ecosystem.",
    ],
    years: ["2017", "2019", "2021", "2023"],
  },
  usa: {
    name: "United States",
    flag: "🇺🇸",
    images: ["/usa-night.jpg"],
    descriptions: [
      "The sprawling metropolis glows across the continent. City grids and highways create intricate light patterns visible from space, helping urban planners understand growth.",
      "Coastal cities illuminate the shoreline in this stunning view. These images help researchers study energy consumption and urban heat island effects.",
    ],
    years: ["2018", "2020", "2022", "2024"],
  },
  japan: {
    name: "Japan",
    flag: "🇯🇵",
    images: ["/japan-night.jpg"],
    descriptions: [
      "Tokyo's vast urban landscape spreads across the Kanto Plain. The city's efficient lighting creates unique patterns that help researchers study sustainable city planning.",
      "Japan's island nation glows brilliantly at night. Dense population centers and transportation networks are clearly visible, providing insights into urban development.",
    ],
    years: ["2016", "2019", "2021", "2023"],
  },
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    images: ["/uk-night.jpg"],
    descriptions: [
      "London's Thames River winds through the illuminated city. Historic landmarks and modern developments create a unique nighttime signature visible from orbit.",
      "The British Isles glow with interconnected cities. These images help monitor urban sprawl and environmental impact across the region.",
    ],
    years: ["2017", "2020", "2022", "2024"],
  },
  france: {
    name: "France",
    flag: "🇫🇷",
    images: ["/france-night.jpg"],
    descriptions: [
      "Paris radiates from the Seine River, with the Eiffel Tower's lights marking the city center. This view showcases Europe's cultural heritage from space.",
      "France's cities create a network of lights across the countryside. Agricultural regions and urban centers are clearly distinguished in these orbital photographs.",
    ],
    years: ["2018", "2020", "2022", "2024"],
  },
  germany: {
    name: "Germany",
    flag: "🇩🇪",
    images: ["/germany-night.jpg"],
    descriptions: [
      "Berlin's grid pattern and historic landmarks shine through the night. The city's development and green spaces are visible in this ISS capture.",
      "Germany's industrial heartland glows with activity. These images help researchers understand the balance between urban development and environmental conservation.",
    ],
    years: ["2017", "2019", "2021", "2023"],
  },
  brazil: {
    name: "Brazil",
    flag: "🇧🇷",
    images: ["/brazil-night.jpg"],
    descriptions: [
      "Rio de Janeiro's coastline curves beautifully along the Atlantic. The city's beaches and mountains create a stunning nighttime view from orbit.",
      "Brazil's vibrant cities illuminate the South American coast. These images help monitor coastal development and environmental changes.",
    ],
    years: ["2016", "2019", "2021", "2024"],
  },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    images: ["/australia-night.jpg"],
    descriptions: [
      "Sydney Harbor's iconic shape is outlined by city lights. The Opera House and surrounding areas create a distinctive pattern visible from space.",
      "Australia's coastal cities stand out against the dark interior. These images help researchers study urban concentration and resource distribution.",
    ],
    years: ["2018", "2020", "2022", "2024"],
  },
  india: {
    name: "India",
    flag: "🇮🇳",
    images: ["/india-night.jpg"],
    descriptions: [
      "The Ganges River valley glows with millions of lights. India's rapid urbanization is clearly visible in these nighttime orbital photographs.",
      "India's cities create a brilliant tapestry of light across the subcontinent. These images help track development and energy usage patterns.",
    ],
    years: ["2017", "2019", "2022", "2024"],
  },
  china: {
    name: "China",
    flag: "🇨🇳",
    images: ["/china-night.jpg"],
    descriptions: [
      "Shanghai's Yangtze River delta blazes with activity. The world's largest cities create stunning light patterns visible from the ISS.",
      "China's urban centers illuminate the landscape. These images provide insights into the world's most rapid urbanization process.",
    ],
    years: ["2016", "2018", "2021", "2023"],
  },
}

export default function CupolaPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; country: string; language: string } | null>(
    null,
  )
  const [skipSplash, setSkipSplash] = useState(false)
  const [step, setStep] = useState(1)
  const [cityInput, setCityInput] = useState("")
  const [yearInput, setYearInput] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentImage, setCurrentImage] = useState<EarthImage | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(3)

  useEffect(() => {
    const data = sessionStorage.getItem("userData")
    if (data) {
      const parsed = JSON.parse(data)
      setUserData(parsed)
      setSelectedCountry(parsed.country || "egypt")
    } else {
      // don't auto-redirect — show a styled splash and let the user start manually
      // if we later want to force navigation we can add a timer or explicit behaviour
    }
  }, [router])

  const handleSearch = async () => {
    if (!cityInput || !yearInput) return

    setIsSearching(true)

    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(cityInput)}&media_type=image&year_start=${yearInput}&year_end=${yearInput}`,
      )
      const data = await response.json()

      if (data.collection.items.length > 0) {
        const item = data.collection.items[0]
        const imageUrl = item.links?.[0]?.href || currentImage?.url

        const image: EarthImage = {
          url: imageUrl,
          title: item.data[0].title,
          year: yearInput,
          description: item.data[0].description || "View from the International Space Station",
          country: cityInput,
          stats: {
            altitude: "408 km",
            speed: "28,000 km/h",
            orbit: "90 min",
            photos: "3.5M+",
          },
        }

        setCurrentImage(image)
        setScore((prev) => prev + 25)
        setStep(2)
      } else {
        throw new Error("No images found")
      }
    } catch (error) {
      // Fallback to local data
      const cityLower = cityInput.toLowerCase()
      let matchedCountry = ""

      if (cityLower.includes("cairo") || cityLower.includes("egypt")) matchedCountry = "egypt"
      else if (cityLower.includes("new york") || cityLower.includes("los angeles") || cityLower.includes("usa"))
        matchedCountry = "usa"
      else if (cityLower.includes("tokyo") || cityLower.includes("japan")) matchedCountry = "japan"
      else if (cityLower.includes("london") || cityLower.includes("uk")) matchedCountry = "uk"
      else if (cityLower.includes("paris") || cityLower.includes("france")) matchedCountry = "france"
      else if (cityLower.includes("berlin") || cityLower.includes("germany")) matchedCountry = "germany"
      else if (cityLower.includes("rio") || cityLower.includes("brazil")) matchedCountry = "brazil"
      else if (cityLower.includes("sydney") || cityLower.includes("australia")) matchedCountry = "australia"
      else if (cityInput.includes("delhi") || cityLower.includes("mumbai") || cityLower.includes("india"))
        matchedCountry = "india"
      else if (cityLower.includes("shanghai") || cityLower.includes("beijing") || cityLower.includes("china"))
        matchedCountry = "china"

      if (matchedCountry && countryData[matchedCountry]) {
        const country = countryData[matchedCountry]
        const randomDescription = country.descriptions[Math.floor(Math.random() * country.descriptions.length)]

        const image: EarthImage = {
          url: country.images[0],
          title: `${country.name} at Night`,
          year: yearInput,
          description: randomDescription,
          country: country.name,
          stats: {
            altitude: "408 km",
            speed: "28,000 km/h",
            orbit: "90 min",
            photos: "3.5M+",
          },
        }

        setCurrentImage(image)
        setScore((prev) => prev + 25)
        setStep(2)
      } else {
        setAttempts((prev) => prev - 1)
        if (attempts <= 1) {
          alert("No more attempts! Moving to next section.")
          router.push("/benefits")
        } else {
          alert(`City not found! ${attempts - 1} attempts remaining.`)
        }
      }
    }

    setIsSearching(false)
  }

  // Always show the Cupola splash until the user explicitly presses Start
  if (!skipSplash) {
    return (
      <main className="min-h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="relative w-full h-screen">
          <Image src="/Cupola.png" alt="Cupola" fill className="object-cover" priority />

          <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end p-12">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-4">THE CUPOLA</h1>
            <p className="text-lg text-white/80 mb-6">Earth's Largest Space Window — explore live orbital imagery</p>
            <div className="flex gap-4">
              <Button
                onClick={() => setSkipSplash(true)}
                size="lg"
                className="h-14 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold"
              >
                Start
              </Button>
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="h-14 bg-white/10 text-white border border-white/20"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#000000] via-[#001122] to-[#000000] text-white relative overflow-hidden font-space-grotesk">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight font-orbitron">THE CUPOLA</h1>
            <p className="text-cyan-400">Earth's Largest Space Window</p>
          </div>

          <div className="inline-flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-full border border-purple-500/40">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="font-bold font-orbitron">Score: {score}</span>
          </div>
        </div>

        <div className="w-full h-[72vh] rounded-3xl overflow-hidden shadow-2xl bg-black/60 border border-slate-800">
          {/* Render the interactive Earth globe here */}
          <EarthGlobe
            fill
            autoRotate
            autoRotateSpeed={0.3}
            pointRadius={0.5}
            onCitySelect={(city: any) => {
              // when a city is selected on the globe, populate the UI similar to search success
              setCurrentImage({
                url: city.image || '/placeholder.jpg',
                title: city.name || 'Selected Location',
                year: String(new Date().getFullYear()),
                description: city.description || 'View from the ISS',
                country: city.country || city.name || '—',
                stats: {
                  altitude: '408 km',
                  speed: '28,000 km/h',
                  orbit: '90 min',
                  photos: '3.5M+',
                },
              })
              setStep(2)
              setScore((s) => Math.min(s + 25, 100))
            }}
          />
        </div>

        {/* If step 2 and currentImage exists show details below the globe */}
        {step === 2 && currentImage && (
          <div className="mt-8">
            <Card className="p-6 bg-slate-900/40 border-slate-700/40 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/3">
                  <Image src={currentImage.url || '/placeholder.svg'} alt={currentImage.title} width={600} height={400} className="rounded-lg object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{currentImage.title}</h3>
                  <p className="text-slate-300 mt-2">{currentImage.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800/50 rounded">Altitude: {currentImage.stats.altitude}</div>
                    <div className="p-3 bg-slate-800/50 rounded">Speed: {currentImage.stats.speed}</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-right">
                <Button
                  onClick={() => {
                    const finalScore = Math.min(score, 25)
                    const currentScore = Number.parseInt(sessionStorage.getItem("totalScore") || "0")
                    sessionStorage.setItem("totalScore", String(Math.min(currentScore + finalScore, 100)))
                    router.push("/benefits")
                  }}
                  size="lg"
                  className="h-12 px-8 text-base bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold shadow-lg font-orbitron"
                >
                  Continue Mission
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
