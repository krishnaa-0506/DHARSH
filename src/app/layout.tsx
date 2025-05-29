import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from '@/contexts/AudioContext';
import AudioPlayer from '@/components/AudioPlayer'; // We'll create this simple wrapper
import AudioControlButton from '@/components/AudioControlButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Dharshana's Digital Journey",
  description: 'An interactive digital experience for Dharshana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased animated-background`}>
        <AudioProvider>
          {children}
          <AudioPlayer src="/audio/background-music.mp3" />
          <AudioControlButton />
        </AudioProvider>
        <Toaster />
      </body>
    </html>
  );
}
