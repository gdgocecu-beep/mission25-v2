import Link from 'next/link';

export default function AstrotextPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-primary mb-8">Astrotext</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <Link 
          href="/astrotext/planets"
          className="px-6 py-4 text-lg font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
        >
          Planets & Solar System
        </Link>
        
        <Link 
          href="/astrotext/stars"
          className="px-6 py-4 text-lg font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
        >
          Stars & Galaxies
        </Link>
        
        <Link 
          href="/astrotext/space-exploration"
          className="px-6 py-4 text-lg font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
        >
          Space Exploration
        </Link>
        
        <Link 
          href="/astrotext/space-phenomena"
          className="px-6 py-4 text-lg font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
        >
          Space Phenomena
        </Link>
      </div>
    </div>
  );
}