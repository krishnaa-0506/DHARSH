'use client';

import { useState, type FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, LockKeyhole } from 'lucide-react';
import AudioPlayer from './AudioPlayer'; // Adjust path as needed

const SECRET_CODE = 'HK-THANGO25'; // Default, can be set via .env.local

export default function CodeEntryForm() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call or verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (code === SECRET_CODE) {
      toast({
        title: 'Access Granted!',
        description: 'Welcome, Dharshana! Your journey begins now.',
        variant: 'default',
      });
      if (isMounted.current) {
        localStorage.removeItem('dharshanaJourneyData');
        localStorage.removeItem('currentScreenId');
        // Attempt to play audio on successful code entry
        const audio = document.querySelector('audio');
        if (audio) {
          audio.play().catch((error) => {
            console.error('Audio playback failed:', error);
            toast({
              title: 'Autoplay Blocked',
              description: 'Please click anywhere on the page to enable background music.',
              variant: 'destructive',
            });
          });
        }
      }
      router.push('/screens/1');
    } else {
      toast({
        title: 'Access Denied',
        description: 'The secret code is incorrect. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      setCode('');
    }
  };

  return (
    <>
      <AudioPlayer src="/audio/background-music.mp3" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="secretCode"
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Secret Code"
            required
            className="pl-10 text-lg h-14 focus:ring-2 focus:ring-ring transition-all duration-300 ease-in-out shadow-inner"
            aria-label="Secret Code"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            'Unlock Journey'
          )}
        </Button>
      </form>
    </>
  );
}