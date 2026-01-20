import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Footer } from '@/components/dashboard/Footer';
import { TelemetryControls } from '@/components/dashboard/TelemetryControls';
import { InteractiveMap } from '@/components/dashboard/InteractiveMap';

import { EventList } from '@/components/dashboard/EventList';
import { DepthChart } from '@/components/dashboard/DepthChart';
import { SystemLog } from '@/components/dashboard/SystemLog';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { useEarthquakeData } from '@/hooks/use-earthquake-data';
import { useAlertSound } from '@/hooks/use-alert-sound';
import { EarthquakeEvent, TelemetryFilters } from '@/types/earthquake';

const Index = () => {
  const [filters, setFilters] = useState<TelemetryFilters>({
    dataSource: 'usgs',
    minMagnitude: 1.0,
    geoFilter: 'global',
  });

  const [selectedEvent, setSelectedEvent] = useState<EarthquakeEvent | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mapboxToken] = useState<string>('pk.eyJ1Ijoibm5hZml6IiwiYSI6ImNtajNmZHIwaTE1NHczZXM4NmtjODF0dGUifQ.6ehvU46ZBLjKjb3G68OwIg');

  const {
    events,
    eventCount,
    maxMagnitude,
    isLive,
    isLoading,
    logs,
    initiateScan,
    toggleLive,
  } = useEarthquakeData(filters);

  const { checkAndAlertNewEvents } = useAlertSound();

  // Check for new events and trigger alerts
  useEffect(() => {
    if (isLive && events.length > 0 && soundEnabled) {
      checkAndAlertNewEvents(events);
    }
  }, [events, isLive, soundEnabled, checkAndAlertNewEvents]);

  const handleEventSelect = (event: EarthquakeEvent) => {
    setSelectedEvent(event);
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header 
        isLive={isLive} 
        onToggleLive={toggleLive} 
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Telemetry Controls */}
        <TelemetryControls
          filters={filters}
          onFiltersChange={setFilters}
          onInitiateScan={initiateScan}
          eventCount={eventCount}
          maxMagnitude={maxMagnitude}
          isLoading={isLoading}
        />

        {/* Center - Map and Bottom Panels */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden min-w-0">
          {/* Map Area */}
          <div className="flex-1 min-h-0">
            <InteractiveMap
              events={events}
              selectedEvent={selectedEvent}
              onEventSelect={handleEventSelect}
              mapboxToken={mapboxToken}
            />
          </div>

          {/* Bottom Section */}
          <div className="flex gap-4 h-56 flex-shrink-0">
            {/* Export Button Area */}
            <div className="flex flex-col justify-end flex-shrink-0">
              <ExportButton events={events} />
            </div>
            
            {/* Depth Chart */}
            <DepthChart events={events} />
            
            {/* System Log */}
            <SystemLog logs={logs} />
          </div>
        </main>

        {/* Right Panel - Event List */}
        <EventList
          events={events}
          onEventSelect={handleEventSelect}
          selectedEventId={selectedEvent?.id}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
