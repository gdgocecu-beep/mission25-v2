import { BookText, Rocket, Video } from 'lucide-react';
import Link from 'next/link';

export default function LearningStylePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <Rocket className="w-16 h-16 mx-auto text-primary animate-float" />
        <h1 className="text-5xl font-bold text-primary">Choose Your Learning Style</h1>
        <p className="text-lg text-muted-foreground">Select the way you prefer to learn about space</p>
      </div>
      
      <div className="flex gap-8 flex-col md:flex-row">
        <Link 
          href="/videos"
          className="group flex flex-col items-center p-8 rounded-xl bg-primary/5 hover:bg-primary/10 
            border-2 border-primary/20 hover:border-primary transition-all duration-300 space-y-4 
            min-w-[250px]"
        >
          <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary">Video Learning</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Learn through interactive videos and animations
            </p>
          </div>
        </Link>
        
        <Link 
          href="/astrotext"
          className="group flex flex-col items-center p-8 rounded-xl bg-secondary/5 hover:bg-secondary/10 
            border-2 border-secondary/20 hover:border-secondary transition-all duration-300 space-y-4
            min-w-[250px]"
        >
          <div className="p-4 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
            <BookText className="w-8 h-8 text-secondary-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-secondary-foreground">Text & Audio Learning</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Read and listen to detailed space content
            </p>
          </div>
        </Link>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="stars-small" />
        <div className="stars-medium" />
        <div className="stars-large" />
      </div>
    </div>
  );
}