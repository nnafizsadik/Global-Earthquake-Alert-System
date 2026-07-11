import { useState, useEffect, useCallback } from 'react';
import { EarthquakeEvent, SystemLogEntry, TelemetryFilters, USGSResponse } from '@/types/earthquake';
import { parseUSGSResponse } from '@/lib/earthquake-utils';

const USGS_ENDPOINT = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';

export function useEarthquakeData(filters: TelemetryFilters) {
  const [events, setEvents] = useState<EarthquakeEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);

  const addLog = useCallback((message: string, type: SystemLogEntry['type'] = 'info', source?: string) => {
    const entry: SystemLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      message,
      type,
      source,
    };
    setLogs(prev => [entry, ...prev].slice(0, 500));
  }, []);

  const fetchData = useCallback(async () => {
    if (!isLive) return;
    
    setIsLoading(true);
    addLog('Connecting to: USGS...', 'info', 'USGS');

    try {
      const response = await fetch(USGS_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch earthquake data');
      
      const data: USGSResponse = await response.json();
      const parsedEvents = parseUSGSResponse(data);
      
      // Apply filters
      const filteredEvents = parsedEvents.filter(event => 
        event.magnitude >= filters.minMagnitude
      );

      setEvents(filteredEvents);
      addLog(`Scan complete. ${filteredEvents.length} events displayed.`, 'success');
    } catch (error) {
      addLog('Connection failed. Retrying...', 'error', 'USGS');
      console.error('Error fetching earthquake data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLive, filters.minMagnitude, addLog]);

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up polling interval (every 30 seconds for demo)
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  const initiateScan = useCallback(() => {
    addLog('Initiating manual scan...', 'info');
    fetchData();
  }, [fetchData, addLog]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => {
      const newState = !prev;
      addLog(newState ? 'Live feed enabled.' : 'Live feed paused.', 'info');
      return newState;
    });
  }, [addLog]);

  // Calculate statistics
  const eventCount = events.length;
  const maxMagnitude = events.length > 0 
    ? Math.max(...events.map(e => e.magnitude)) 
    : 0;

  return {
    events,
    eventCount,
    maxMagnitude,
    isLive,
    isLoading,
    logs,
    initiateScan,
    toggleLive,
    addLog,
  };
}
