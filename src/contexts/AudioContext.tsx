'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false); // Music starts paused
  const audioRef = useRef<HTMLAudioElement>(null);

  // Effect to update isPlaying state if audio is paused/played by other means (e.g. ended)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false); // Covers pause and ended

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handlePause); // Treat ended as paused

      // Set initial state based on the audio element's paused status
      // This handles scenarios where the audio element might already be playing or paused
      // due to browser behavior or previous interactions if the page was reloaded.
      setIsPlaying(!audio.paused);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handlePause);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error attempting to play audio:", error);
          // If play fails (e.g., due to autoplay restrictions), ensure UI reflects paused state.
          // No need to setIsPlaying(false) here, as the 'pause' event listener will handle it if play fails.
        });
      }
      // Remove optimistic update. The 'play' and 'pause' event listeners will update the state.
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause, audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
