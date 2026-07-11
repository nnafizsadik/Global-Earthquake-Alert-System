import { useRef, useCallback, useEffect } from 'react';
import { EarthquakeEvent } from '@/types/earthquake';

export function useAlertSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAlertedEventsRef = useRef<Set<string>>(new Set());

  const playAlertBeep = useCallback((magnitude: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Higher pitch and more urgent sound for critical events
    if (magnitude >= 5.0) {
      // Critical - urgent alarm
      oscillator.frequency.value = 880;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1);

      // Add second beep for critical
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        osc2.type = 'sawtooth';
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.5);
      }, 200);
    } else if (magnitude >= 3.0) {
      // Moderate - attention beep
      oscillator.frequency.value = 660;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } else {
      // Minor - soft beep
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    }
  }, []);

  const checkAndAlertNewEvents = useCallback((events: EarthquakeEvent[]) => {
    const currentEventIds = new Set(events.map(e => e.id));
    
    events.forEach(event => {
      if (!lastAlertedEventsRef.current.has(event.id)) {
        // New event detected - play sound based on magnitude
        playAlertBeep(event.magnitude);
        
        // Show browser notification for significant events
        if (event.magnitude >= 3.0 && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(`Earthquake Alert: M${event.magnitude.toFixed(1)}`, {
            body: `${event.place}\nDepth: ${event.depth.toFixed(1)} km`,
            icon: '/favicon.ico',
            tag: event.id,
          });
        }
      }
    });

    // Update the set of alerted events
    lastAlertedEventsRef.current = currentEventIds;
  }, [playAlertBeep]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return { checkAndAlertNewEvents, playAlertBeep };
}
