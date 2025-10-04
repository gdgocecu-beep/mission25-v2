'use client';

import { Loader2, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Benefit {
  id: number;
  title: string;
  image: string;
  benefit_story: string;
  astronaut: string;
  video_link: string;
}

export default function AstrotextPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await fetch('https://mission-25-backend.vercel.app/api/benefits');
        if (!response.ok) throw new Error('Failed to fetch benefits');
        const data = await response.json();
        setBenefits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading space benefits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <Rocket className="w-16 h-16 mx-auto text-primary animate-float" />
        <h1 className="text-4xl font-bold text-primary">Space Benefits</h1>
        <p className="text-lg text-muted-foreground">Discover how space exploration helps life on Earth</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {benefits.map((benefit) => (
          <Link 
            key={benefit.id}
            href={`/astrotext/benefit/${benefit.id}`}
            className="group flex flex-col p-6 rounded-xl bg-accent/5 hover:bg-accent/10 
              border-2 border-accent/20 hover:border-accent transition-all duration-300
              text-accent-foreground hover:text-accent-foreground"
          >
            <h2 className="text-xl font-semibold mb-2">{benefit.title}</h2>
            <p className="text-sm text-muted-foreground">
              Click to learn more about this space benefit
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              {benefit.astronaut}
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="stars-small" />
        <div className="stars-medium" />
        <div className="stars-large" />
      </div>
    </div>
  );
}