'use client';

import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const { audioRef } = useAudio();

  useEffect(() => {
    if (!audioRef.current) return; // Skip if audioRef is not initialized
    // Ensure the src is always set to the correct path
    audioRef.current.src = src;
    audioRef.current.load(); // Load the new source
  }, [src, audioRef]); // Consistent dependency array

  useEffect(() => {
    if (!audioRef.current) return; // Skip if audioRef is not initialized
    const handlePlay = () => {
      audioRef.current?.play().catch((error) => {
        console.error('Audio playback failed:', error.message);
      });
    };
    document.addEventListener('click', handlePlay);
    return () => document.removeEventListener('click', handlePlay);
  }, [audioRef]); // Consistent dependency array

  return <audio ref={audioRef} preload="auto" />; // Add preload="auto"
}