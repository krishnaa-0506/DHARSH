import CodeEntryForm from '@/components/CodeEntryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function CodeEntryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 selection:bg-primary selection:text-primary-foreground">
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Enhanced background decorative elements */}
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full filter blur-[120px] animate-pulse opacity-40"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full filter blur-[120px] animate-pulse opacity-40 animation-delay-4000"></div>
         <div className="absolute top-1/3 right-10 w-1/3 h-1/3 bg-secondary/15 rounded-full filter blur-[100px] animate-pulse opacity-30 animation-delay-2000"></div>
      </div>
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl shadow-2xl border-border/50 z-10 animate-fadeIn">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 p-4 bg-primary/20 rounded-full w-fit border border-primary/30 shadow-lg">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary py-1">
            Dharshana's Digital Journey
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground pt-3">
            Enter the secret code to begin your adventure.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <CodeEntryForm />
        </CardContent>
      </Card>
      <footer className="absolute bottom-6 text-center text-md text-muted-foreground/80 z-10">
        Crafted with <span className="text-red-400 animate-pulse">&hearts;</span> for Dharshana
      </footer>
    </main>
  );
}

// Keyframes are now in tailwind.config.ts or globals.css, so style injection is removed.
// The animation-delay-4000 class can be added to tailwind.config.ts if needed or applied via style prop.
// For simplicity, assuming tailwind.config.ts handles common animations.
// If specific delays are needed, they can be utility classes or inline styles.
// Tailwind config already has:
// animation: { 'fade-in': 'fade-in 0.5s ease-out forwards' }
// It also has animation-delay utilities if you install a plugin or define them.
// Example of adding a delay class to tailwind.config.ts plugins:
// plugin(function({ addUtilities }) {
//   addUtilities({
//     '.animation-delay-2000': { 'animation-delay': '2s' },
//     '.animation-delay-4000': { 'animation-delay': '4s' },
//   })
// })
// For this exercise, I'll rely on the existing pulse and fadeIn from tailwind config.
// The `animation-delay-4000` was part of the original decorative pulses.
// I will add animation-delay to tailwind config.
