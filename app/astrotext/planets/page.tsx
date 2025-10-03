import Image from 'next/image';

export default function PlanetsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8 animate-fade-in">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-primary mb-8">Our Solar System</h1>
        
        <div className="relative aspect-video w-full mb-4">
          <Image
            src="/images/solar-system.jpg"
            alt="Solar System"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Image Credit: NASA/JPL-Caltech
        </p>
        
        <div className="prose prose-lg dark:prose-invert">
          <p>
            Our solar system consists of the Sun and everything that orbits around it. 
            This includes eight planets, numerous moons, asteroids, comets, and other 
            celestial objects. Each planet has its unique characteristics and plays a 
            crucial role in our cosmic neighborhood.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  );
}