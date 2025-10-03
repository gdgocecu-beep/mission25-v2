import Link from 'next/link';

export default function LearningStylePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-primary">Choose Your Learning Style</h1>
      
      <div className="flex gap-8">
        <Link 
          href="/videos"
          className="px-8 py-4 text-xl font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Video Learning
        </Link>
        
        <Link 
          href="/astrotext"
          className="px-8 py-4 text-xl font-semibold rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
        >
          Text & Audio Learning
        </Link>
      </div>
    </div>
  );
}