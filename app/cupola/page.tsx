"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"
import dynamic from 'next/dynamic'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
// Lazy-load EarthGlobe to avoid increasing initial bundle size
const EarthGlobe = dynamic(() => import('@/components/earth-globe'), { ssr: false })

interface EarthImage {
  url: string
  title: string
  year: string
  description: string
  country: string
}

const cityData: Record<
  string,
  {
    name: string
    country: string
    flag: string
    image: string
    description: string
    year: string
  }
> = {
  cairo: {
    name: "Cairo",
    country: "Egypt",
    flag: "🇪🇬",
    image: "https://images-assets.nasa.gov/image/iss066e128266/iss066e128266~medium.jpg",
    description: "The city lights of Cairo and New Cairo City in Egypt were captured during a nighttime orbital pass from the ISS. This observation from 260 miles above the Sinai Peninsula helps scientists track urban growth patterns and energy usage, supporting sustainable development planning for one of Africa's largest metropolitan areas.",
    year: "2022",
  },
  delhi: {
    name: "New Delhi",
    country: "India",
    flag: "🇮🇳",
    image: "https://images-assets.nasa.gov/image/PIA21100/PIA21100~large.jpg",
    description: "In 2020, astronauts on the ISS captured New Delhi's urban growth and air quality patterns. These images helped scientists track pollution levels and their impact on millions of residents, leading to better urban planning and air quality management strategies.",
    year: "2020",
  },
  beijing: {
    name: "Beijing",
    country: "China",
    flag: "🇨🇳",
    image: "https://images-assets.nasa.gov/image/iss026e010155/iss026e010155~large.jpg",
    description: "ISS astronauts documented Beijing's rapid urban development in 2016. These space-based observations helped city planners understand the heat island effect and implement green spaces to improve air quality and reduce urban temperatures.",
    year: "2016",
  },
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001701/GSFC_20171208_Archive_e001701~orig.jpg",
    description: "The ISS captured Tokyo's nighttime illumination patterns in 2019, revealing energy usage across the world's largest metropolitan area. This data helped optimize power distribution and identify opportunities for energy conservation.",
    year: "2019",
  },
  paris: {
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    image: "https://images-assets.nasa.gov/image/PIA11168/PIA11168~large.jpg",
    description: "In 2017, astronauts photographed Paris's historic layout from space, highlighting its unique urban planning. These images aided in preserving cultural heritage while adapting the city for climate change challenges.",
    year: "2017",
  },
  london: {
    name: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images-assets.nasa.gov/image/iss073e0698351/iss073e0698351~medium.jpg",
    description: "The ISS captured London's growth along the Thames in 2014. These observations helped monitor urban sprawl and riverside development, supporting flood management and sustainable city planning.",
    year: "2014",
  },
  berlin: {
    name: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    image: "https://images-assets.nasa.gov/image/iss045e027165/iss045e027165~large.jpg",
    description: "Astronauts photographed Berlin's unique east-west development patterns in 2015. These images helped urban planners understand historical division impacts and guide unified city development strategies.",
    year: "2015",
  },
  newyork: {
    name: "New York",
    country: "United States",
    flag: "🇺🇸",
    image: "https://images-assets.nasa.gov/image/s36-39-014/s36-39-014~medium.jpg",
    description: "From space, New York City shines like a galaxy along the coast. In 1990, astronauts on the Space Shuttle Atlantis captured its glowing streets and bridges, showing how much energy the city uses and how far its lights reach. These images help planners fight light pollution, save power, and make the city healthier for people and wildlife.",
    year: "2015",
  },
  sydney: {
    name: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    image: "https://images-assets.nasa.gov/image/ast-16-1132/ast-16-1132~medium.jpg",
    description: "In 1975, during the Apollo–Soyuz mission, astronauts photographed South Australia’s Flinders Ranges and salt lakes from orbit. These images helped scientists study Australia’s dry landscapes, water basins, and land use long before satellites became common. They provided early insights into how desert regions store water and support life in extreme conditions.",
  },
  rio: {
    name: "Rio de Janeiro",
    country: "Brazil",
    flag: "🇧🇷",
    image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000252/GSFC_20171208_Archive_e000252~large.jpg",
    description: "As Rio prepared for the 2016 Summer Olympics, NASA’s Landsat 8 satellite captured detailed images of the Olympic Park and the city around it. These space views showed how new stadiums, housing, and transportation networks were shaping the coastline. Scientists also used this data to track urban growth and how large events can change land use in big cities.",
    year: "2016",
  }
}

export default function CupolaPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; country: string; language: string } | null>(
    null,
  )
  const [skipSplash, setSkipSplash] = useState(false)
  const [step, setStep] = useState(1)
  const [countryInput, setCountryInput] = useState("")
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
  if (!countryInput) return;
  setIsSearching(true);

  try {
    // Connect to our backend API
    const response = await fetch(
      `https://mission-25-backend.vercel.app/api/cupola?query=${encodeURIComponent(countryInput)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    // Create image object from API response
    const image: EarthImage = {
      url: data.url,
      title: data.title,
      year: new Date(data.date_created).getFullYear().toString(),
      description: data.benefit,
      country: countryInput,
    };

    setCurrentImage(image);
    setScore((prev) => prev + 25);
    setStep(2);

  } catch (error) {
     // Keep the existing fallback logic for when API fails
    const countryLower = countryInput.toLowerCase();
    let matchedCountry = "";

    // Simplified country matching
    if (countryLower.includes("egypt")) matchedCountry = "egypt"
    else if (countryLower.includes("united states") || countryLower.includes("usa")) matchedCountry = "usa"
    else if (countryLower.includes("japan")) matchedCountry = "japan"
    else if (countryLower.includes("united kingdom") || countryLower.includes("uk")) matchedCountry = "uk"
    else if (countryLower.includes("france")) matchedCountry = "france"
    else if (countryLower.includes("germany")) matchedCountry = "germany"
    else if (countryLower.includes("brazil")) matchedCountry = "brazil"
    else if (countryLower.includes("australia")) matchedCountry = "australia"
    else if (countryLower.includes("india")) matchedCountry = "india"
    else if (countryLower.includes("china")) matchedCountry = "china"

      if (matchedCountry && countryData[matchedCountry]) {
      const country = countryData[matchedCountry];
      const randomDescription = country.descriptions[Math.floor(Math.random() * country.descriptions.length)];

      const image: EarthImage = {
        url: country.images[0],
        title: `${country.name} at Night`,
        year: String(new Date().getFullYear()),
        description: randomDescription,
        country: country.name,
      };

      setCurrentImage(image);
      setScore((prev) => prev + 25);
      setStep(2);
    } else {
      setAttempts((prev) => prev - 1);
      if (attempts <= 1) {
        alert("No more attempts! Moving to next section.");
        router.push("/benefits");
      } else {
        alert(`City not found! ${attempts - 1} attempts remaining.`);
      }
    }
  } finally {
    setIsSearching(false);
  }
};

  const handleRandomize = () => {
    // pick a random country from countryData
    const keys = Object.keys(countryData)
    if (!keys.length) return
    const rand = keys[Math.floor(Math.random() * keys.length)]
    const country = countryData[rand]
    const image: EarthImage = {
      url: country.images[0],
      title: `${country.name} at Night`,
      year: String(new Date().getFullYear()),
      description: country.descriptions[Math.floor(Math.random() * country.descriptions.length)],
      country: country.name,
    }

    setCurrentImage(image)
    setScore((prev) => prev + 25)
    setStep(2)
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

        </div>

        {/* search UI is now an overlay inside the globe container (see below) */}

        <div className="w-full h-[72vh] rounded-3xl overflow-hidden shadow-2xl bg-black/60 border border-slate-800 relative">
          {/* Overlay search controls (top-right) */}
          <div className="absolute top-4 left-4 z-20 w-[280px] p-3 rounded-lg bg-black/60 border border-slate-700 backdrop-blur-sm">
  <div className="flex gap-2 items-center">
    <Input
      type="text"
      placeholder="City (e.g. Cairo)"
      value={countryInput}
      onChange={(e) => setCountryInput(e.target.value)}
      className="flex-1 h-9 bg-transparent border-slate-600 text-white"
    />
    <Button
      onClick={handleSearch}
      disabled={!countryInput || isSearching}
      size="sm"
      className="h-9 w-9 p-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
    >
      {isSearching ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </Button>
    <Button
      onClick={handleRandomize}
      size="sm"
      className="h-9 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
    >
      Random
    </Button>
  </div>
</div>
          {/* Render the interactive Earth globe here */}
   <EarthGlobe
  fill
  pointRadius={0.5}
  onCitySelect={(location: any) => {
    const cityName = location.name.toLowerCase();
    let matchedCity = "";

    // Match cities
    if (cityName.includes("cairo")) matchedCity = "cairo"
else if (cityName.includes("washington")) matchedCity = "washington"
else if (cityName.includes("sacramento")) matchedCity = "sacramento"
else if (cityName.includes("delhi")) matchedCity = "delhi"
else if (cityName.includes("beijing")) matchedCity = "beijing"
else if (cityName.includes("tokyo")) matchedCity = "tokyo"
else if (cityName.includes("paris")) matchedCity = "paris"
else if (cityName.includes("london")) matchedCity = "london"
else if (cityName.includes("berlin")) matchedCity = "berlin"
else if (cityName.includes("new york")) matchedCity = "newyork"
else if (cityName.includes("sydney")) matchedCity = "sydney"
else if (cityName.includes("rio")) matchedCity = "rio"
    
    if (matchedCity && cityData[matchedCity]) {
      const city = cityData[matchedCity];
      
      const image: EarthImage = {
        url: city.image,
        title: `${city.name}, ${city.country}`,
        year: city.year,
        description: city.description,
        country: city.country
      };

      setCurrentImage(image);
      setStep(2);
      setScore((s) => Math.min(s + 25, 100));
    } else {
      console.log('No data available for:', location.name);
    }
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
