import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map, ExternalLink } from 'lucide-react';

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

export function MapTokenInput({ onTokenSubmit }: MapTokenInputProps) {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="relative w-full h-full bg-card rounded-md border border-border flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Map className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-display font-semibold mb-2">Enable Interactive Map</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your Mapbox public token to enable the interactive earthquake map with zoom, scroll, and real-time markers.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91ci10b2tlbi1oZXJlIi4uLg=="
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="text-xs"
          />
          <Button type="submit" className="w-full" disabled={!token.trim()}>
            Enable Map
          </Button>
        </form>
        <a
          href="https://mapbox.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-4"
        >
          Get a free Mapbox token <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
