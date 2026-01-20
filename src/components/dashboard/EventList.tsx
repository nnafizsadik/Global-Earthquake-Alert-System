import { EarthquakeEvent } from '@/types/earthquake';
import { formatMagnitude, formatTime, getSeverityLevel } from '@/lib/earthquake-utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventListProps {
  events: EarthquakeEvent[];
  onEventSelect: (event: EarthquakeEvent) => void;
  selectedEventId?: string;
}

export function EventList({ events, onEventSelect, selectedEventId }: EventListProps) {
  return (
    <aside className="w-96 flex-shrink-0 flex flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-primary font-display">
          Detected Events
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Latest First
        </span>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {events.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No events detected. Waiting for data...
            </div>
          ) : (
            events.map((event) => {
              const severity = getSeverityLevel(event.magnitude);
              const isSelected = event.id === selectedEventId;
              
              return (
                <div
                  key={event.id}
                  onClick={() => onEventSelect(event)}
                  className={`event-item ${isSelected ? 'bg-secondary/80' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`mag-badge ${
                          severity === 'critical' ? 'mag-critical' :
                          severity === 'moderate' ? 'mag-moderate' : 'mag-minor'
                        }`}>
                          {formatMagnitude(event.magnitude)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 truncate">
                        {event.place}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
                      {formatTime(event.time)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
