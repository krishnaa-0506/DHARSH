"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-destructive/20 rounded-full w-fit">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">A Glitch in the Journey!</CardTitle>
          <CardDescription className="text-destructive-foreground pt-2">
            Something unexpected happened.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || "An unknown error occurred."}
          </p>
          <Button
            onClick={() => reset()}
            variant="destructive"
            className="w-full"
          >
            Try to Continue Journey
          </Button>
           <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Back to Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
