"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
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
      router.push("/")
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

  if (!userData) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#000000] via-[#001122] to-[#000000] text-white relative overflow-hidden font-space-grotesk">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 text-center space-y-4">
          <div className="flex justify-center gap-6 items-center mb-6">
            <Image
              src="/egypt-cupola.jpg"
              alt="ISS Cupola Window"
              width={120}
              height={120}
              className="rounded-2xl shadow-2xl border-2 border-cyan-500/50"
            />
            <div className="text-6xl">🪟</div>
            <Image
              src="/usa-night.jpg"
              alt="Earth from Cupola"
              width={120}
              height={120}
              className="rounded-2xl shadow-2xl border-2 border-cyan-500/50"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-orbitron">THE CUPOLA</h1>
          <p className="text-xl text-cyan-400 font-light">Earth's Largest Space Window</p>
          <div className="inline-flex items-center gap-2 bg-purple-900/40 px-6 py-3 rounded-full border border-purple-500/50">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="font-bold font-orbitron">Score: {score}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {step === 1 && (
            <Card className="p-8 bg-slate-900/40 border-slate-700/40 backdrop-blur-xl">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-2 font-orbitron">MISSION BRIEFING</h3>
                <p className="text-slate-300">Search for a city on Earth using the Cupola's advanced imaging system</p>
                <div className="mt-4 text-yellow-400 font-bold">Attempts Remaining: {attempts}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-cyan-400">City Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Cairo, Tokyo, New York..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="h-14 bg-slate-800/60 border-slate-600 text-white text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-cyan-400">Year</label>
                  <Input
                    type="number"
                    placeholder="2015-2024"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    min="2015"
                    max="2024"
                    className="h-14 bg-slate-800/60 border-slate-600 text-white text-lg"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!cityInput || !yearInput || isSearching}
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg font-orbitron"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      SCANNING EARTH...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      SEARCH FROM SPACE
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && currentImage && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-gradient-to-b from-slate-900/60 to-slate-950/60 border-slate-700/40 backdrop-blur-xl">
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
                    <div className="absolute top-3 left-3 w-6 h-6 bg-slate-700 rounded-full border-4 border-slate-600 z-10 shadow-lg" />
                    <div className="absolute top-3 right-3 w-6 h-6 bg-slate-700 rounded-full border-4 border-slate-600 z-10 shadow-lg" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 bg-slate-700 rounded-full border-4 border-slate-600 z-10 shadow-lg" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 bg-slate-700 rounded-full border-4 border-slate-600 z-10 shadow-lg" />

                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

                    <Image
                      src={currentImage.url || "/placeholder.svg"}
                      alt={currentImage.title}
                      width={1200}
                      height={800}
                      className="w-full h-[500px] md:h-[600px] object-cover"
                      priority
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-cyan-400" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-center text-white">{currentImage.title}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
                      <div className="text-3xl mb-1">📅</div>
                      <div className="text-2xl font-bold text-cyan-400">{currentImage.year}</div>
                      <div className="text-xs text-slate-400 mt-1">Year</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
                      <div className="text-3xl mb-1">📏</div>
                      <div className="text-2xl font-bold text-blue-400">{currentImage.stats.altitude}</div>
                      <div className="text-xs text-slate-400 mt-1">Altitude</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
                      <div className="text-3xl mb-1">⚡</div>
                      <div className="text-2xl font-bold text-purple-400">{currentImage.stats.speed}</div>
                      <div className="text-xs text-slate-400 mt-1">Speed</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
                      <div className="text-3xl mb-1">🔄</div>
                      <div className="text-2xl font-bold text-green-400">{currentImage.stats.orbit}</div>
                      <div className="text-xs text-slate-400 mt-1">Orbit Time</div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border border-cyan-800/40 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🤖</div>
                      <p className="text-lg text-slate-200 leading-relaxed flex-1">{currentImage.description}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => {
                    const finalScore = Math.min(score, 25)
                    const currentScore = Number.parseInt(sessionStorage.getItem("totalScore") || "0")
                    sessionStorage.setItem("totalScore", String(Math.min(currentScore + finalScore, 100)))
                    router.push("/benefits")
                  }}
                  size="lg"
                  className="h-16 px-12 text-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold shadow-lg font-orbitron"
                >
                  Continue Mission
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
