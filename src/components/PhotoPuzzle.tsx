
// src/components/PhotoPuzzle.tsx
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Lightbulb, Puzzle } from 'lucide-react'; // Added Puzzle icon

interface PhotoPuzzleProps {
  imageUrl: string;
  imageAiHint?: string;
  onSolve?: () => void;
  title?: string; // Optional title for the puzzle screen
  description?: string; // Optional description for the puzzle
}

export default function PhotoPuzzle({ imageUrl, imageAiHint, onSolve, title, description }: PhotoPuzzleProps) {
  const [solved, setSolved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSolveClick = () => {
    setSolved(true);
    if (onSolve) {
      setTimeout(onSolve, 1200); // Slightly longer delay for animation
    }
  };

  // A simple "puzzle" effect for the image - can be enhanced
  const puzzlePieceStyle: CSSProperties = isMounted && !solved ? {
    filter: 'saturate(0.5) blur(1px)',
    transform: 'scale(0.98)',
    transition: 'all 0.5s ease-in-out',
  } : {
    transition: 'all 0.5s ease-in-out',
  };


  return (
    <div className="w-full py-6 animate-fadeIn">
      {/* CardHeader and Title are now part of the parent InteractiveScreenClient for consistency */}
      {/* Content related to the puzzle itself is here */}
      <div className="flex flex-col items-center space-y-6">
        <div 
          className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden shadow-xl border-2 border-primary/60 group"
          style={{
            boxShadow: '0 10px 20px -5px hsl(var(--primary) / 0.25), 0 4px 8px -4px hsl(var(--primary) / 0.25)',
          }}
        >
          <Image
            src={imageUrl}
            alt={imageAiHint || "Photo puzzle image"}
            layout="fill"
            objectFit="contain" // Changed to contain to see whole puzzle
            data-ai-hint={imageAiHint || "puzzle piece"}
            className={`transition-all duration-700 ease-in-out ${solved ? 'opacity-100 saturate-100 blur-0 scale-100' : 'opacity-70 saturate-50 blur-sm group-hover:opacity-90 group-hover:saturate-75 group-hover:blur-xs'}`}
            style={puzzlePieceStyle}
          />
           {solved && isMounted && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center backdrop-blur-sm animate-fadeIn">
              <ThumbsUp className="w-16 h-16 text-green-400 mb-4 animate-bounce-slow" />
              <p className="text-foreground text-2xl font-bold">Unveiled!</p>
              <p className="text-muted-foreground mt-1">The path clears...</p>
            </div>
          )}
        </div>
        
        {!solved ? (
          <Button onClick={handleSolveClick} size="lg" className="mt-4 transform hover:scale-105 active:scale-95 transition-transform duration-200 ease-out">
            <Puzzle className="mr-2 h-5 w-5" /> Reveal This Piece of the Story
          </Button>
        ) : (
           <p className="text-green-400 font-semibold mt-4">Brilliantly done! The journey continues...</p>
        )}
        <p className="text-sm text-muted-foreground mt-2 px-4 text-center">
          (This is a symbolic puzzle. Click the button to "solve" it and proceed.)
        </p>
      </div>
    </div>
  );
}

