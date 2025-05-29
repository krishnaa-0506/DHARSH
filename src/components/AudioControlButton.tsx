'use client';

import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AudioControlButton() {
  // Remove local audioRef, isPlaying state, and localIsPlaying state
  const { audioRef, isPlaying, togglePlayPause } = useAudio();
  const { toast } = useToast();

  // Remove unused handleToggle function

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={togglePlayPause} // Use the togglePlayPause from context
      className="fixed bottom-5 right-5 z-50 bg-background/70 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground shadow-lg rounded-full h-12 w-12"
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'} // Use isPlaying from context
      title={isPlaying ? 'Pause Music' : 'Play Music'} // Use isPlaying from context
    >
      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />} // Use isPlaying from context
    </Button>
  );
}
