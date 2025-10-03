import Link from "next/link"

export default function BenefitsArticlesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#07101e] to-black text-white p-8 font-space-grotesk">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-4">Space Articles</h1>
        <p className="mb-8 text-lg opacity-80">Explore curated space science articles and long-form reads about Earth observation, climate, and astronaut life.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold">How Satellites Monitor Wildfires</h2>
            <p className="mt-2 text-sm opacity-80">A deep dive into thermal imaging and early warning systems that save lives.</p>
            <Link href="#" className="mt-4 inline-block text-sm text-blue-300">Read more →</Link>
          </article>

          <article className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-2xl font-semibold">Microgravity: Training & Science</h2>
            <p className="mt-2 text-sm opacity-80">Stories from the Neutral Buoyancy Lab and how astronauts prepare for space.</p>
            <Link href="#" className="mt-4 inline-block text-sm text-blue-300">Read more →</Link>
          </article>
        </div>
      </div>
    </main>
  )
}
