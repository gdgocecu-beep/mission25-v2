'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
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

export default function BenefitPage({ params }: { params: { id: string } }) {
  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefit = async () => {
      try {
        const response = await fetch(`https://mission-25-backend.vercel.app/api/benefits`);
        if (!response.ok) throw new Error('Failed to fetch benefit');
        const benefits = await response.json();
        const selectedBenefit = benefits.find((b: Benefit) => b.id === parseInt(params.id));
        if (!selectedBenefit) throw new Error('Benefit not found');
        setBenefit(selectedBenefit);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefit();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading benefit details...</p>
      </div>
    );
  }

  if (error || !benefit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive">
        <p>Error: {error || 'Benefit not found'}</p>
        <Link href="/astrotext" className="mt-4 text-primary hover:underline">
          Back to benefits
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in">
      <div className="max-w-4xl w-full space-y-8">
        <Link 
          href="/astrotext" 
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to benefits
        </Link>

        <h1 className="text-4xl font-bold text-primary">{benefit.title}</h1>

        <div className="relative aspect-video w-full rounded-xl overflow-hidden">
          <Image
            src={benefit.image}
            alt={benefit.title}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-sm text-muted-foreground italic">
          {benefit.astronaut}
        </p>

        <div className="prose prose-lg dark:prose-invert">
          <p>{benefit.benefit_story}</p>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="stars-small" />
        <div className="stars-medium" />
        <div className="stars-large" />
      </div>
    </div>
  );
}