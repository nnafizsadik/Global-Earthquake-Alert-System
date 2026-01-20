import { EarthquakeEvent } from '@/types/earthquake';
import { getSeverityColor, getMarkerSize, formatMagnitude, formatTime } from '@/lib/earthquake-utils';
import worldMapDark from '@/assets/world-map-dark.png';

interface EarthquakeMapProps {
  events: EarthquakeEvent[];
  selectedEvent: EarthquakeEvent | null;
  onEventSelect: (event: EarthquakeEvent) => void;
}

function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur border border-border rounded-md p-3 text-xs space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-critical" />
        <span>&gt; M5.0 (Critical)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-moderate" />
        <span>M3.0 - M4.9 (Moderate)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-minor" />
        <span>&lt; M3.0 (Minor)</span>
      </div>
    </div>
  );
}

export function EarthquakeMap({ events, selectedEvent, onEventSelect }: EarthquakeMapProps) {
  // Convert lat/lng to x/y percentage (equirectangular projection)
  const coordToPercent = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });

  return (
    <div className="relative w-full h-full bg-[#0a1628] rounded-md overflow-hidden border border-border">
      {/* World map background image */}
      <img 
        src={worldMapDark}
        alt="World Map"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Event markers container */}
      <div className="absolute inset-0">
        {events.map((event) => {
          const pos = coordToPercent(event.latitude, event.longitude);
          const color = getSeverityColor(event.magnitude);
          const size = getMarkerSize(event.magnitude);
          const isSelected = selectedEvent?.id === event.id;
          
          return (
            <div
              key={event.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onClick={() => onEventSelect(event)}
            >
              {/* Outer glow ring for critical/selected events */}
              {(event.magnitude >= 5 || isSelected) && (
                <div
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: size * 4,
                    height: size * 4,
                    backgroundColor: color,
                    opacity: 0.3,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
              {/* Main marker */}
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: size * 2,
                  height: size * 2,
                  backgroundColor: color,
                  border: isSelected ? '2px solid white' : `2px solid ${color}`,
                  boxShadow: `0 0 ${size}px ${color}`,
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Selected event popup */}
      {selectedEvent && (
        <div 
          className="absolute z-50 bg-card border border-border rounded-md p-3 text-xs shadow-xl pointer-events-none"
          style={{
            left: `${Math.min(Math.max(coordToPercent(selectedEvent.latitude, selectedEvent.longitude).x, 15), 85)}%`,
            top: `${Math.min(Math.max(coordToPercent(selectedEvent.latitude, selectedEvent.longitude).y, 15), 70)}%`,
            transform: 'translate(-50%, -120%)',
          }}
        >
          <div className="font-display font-bold text-lg" style={{ color: getSeverityColor(selectedEvent.magnitude) }}>
            {formatMagnitude(selectedEvent.magnitude)}
          </div>
          <div className="text-sm text-foreground mt-1 max-w-[200px]">{selectedEvent.place}</div>
          <div className="text-muted-foreground mt-2 space-y-0.5">
            <div>Depth: {selectedEvent.depth.toFixed(1)} km</div>
            <div>Time: {formatTime(selectedEvent.time)}</div>
          </div>
        </div>
      )}
      
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
        <button className="w-8 h-8 bg-card border border-border rounded flex items-center justify-center text-foreground hover:bg-secondary transition-colors text-lg font-bold">
          +
        </button>
        <button className="w-8 h-8 bg-card border border-border rounded flex items-center justify-center text-foreground hover:bg-secondary transition-colors text-lg font-bold">
          −
        </button>
      </div>
      
      <MapLegend />
    </div>
  );
}
