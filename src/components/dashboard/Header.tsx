import { Zap, Volume2, VolumeX, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  isLive: boolean;
  onToggleLive: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({ isLive, onToggleLive, soundEnabled, onToggleSound }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-primary tracking-wider">
            TEAM ABSOLUTE ZERO
          </span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Real-Time Detection
          </div>
          <div className="text-sm font-semibold uppercase tracking-wide">
            Global Earthquake Alert System
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onToggleLive}
          className={`live-badge flex items-center gap-2 transition-all ${
            isLive ? 'opacity-100' : 'opacity-50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          Live Feed
        </button>

        <button
          onClick={onToggleSound}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
            soundEnabled 
              ? 'border-primary/50 bg-primary/10 text-primary' 
              : 'border-border bg-card text-muted-foreground'
          }`}
          title={soundEnabled ? 'Disable alert sounds' : 'Enable alert sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="text-xs uppercase tracking-wide">
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-500/10">
          <Bell className="w-4 h-4 text-amber-500" />
          <span className="text-xs uppercase tracking-wide text-amber-500">
            Alerts Active
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold tracking-wider tabular-nums">
            {formattedTime}
          </span>
        </div>
      </div>
    </header>
  );
}
