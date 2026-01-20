import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EarthquakeEvent } from '@/types/earthquake';
import { getSeverityColor, formatMagnitude, formatTime } from '@/lib/earthquake-utils';

interface InteractiveMapProps {
  events: EarthquakeEvent[];
  selectedEvent: EarthquakeEvent | null;
  onEventSelect: (event: EarthquakeEvent) => void;
  mapboxToken: string;
}

export function InteractiveMap({ events, selectedEvent, onEventSelect, mapboxToken }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 2,
      projection: 'mercator',
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when events change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    events.forEach((event) => {
      const color = getSeverityColor(event.magnitude);
      const size = Math.max(12, event.magnitude * 6);

      // Create marker element
      const el = document.createElement('div');
      el.className = 'earthquake-marker';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = `2px solid ${color}`;
      el.style.boxShadow = `0 0 ${size / 2}px ${color}`;
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s ease';

      // Add pulse animation for critical events
      if (event.magnitude >= 5.0) {
        el.style.animation = 'pulse 2s infinite';
      }

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      el.addEventListener('click', () => {
        onEventSelect(event);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([event.longitude, event.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [events, onEventSelect]);

  // Handle selected event
  useEffect(() => {
    if (!map.current || !selectedEvent) return;

    // Remove existing popup
    if (popupRef.current) {
      popupRef.current.remove();
    }

    // Fly to selected event
    map.current.flyTo({
      center: [selectedEvent.longitude, selectedEvent.latitude],
      zoom: 6,
      duration: 1500,
    });

    // Create popup
    const popupContent = `
      <div style="background: #1a2332; color: #fff; padding: 12px; border-radius: 8px; min-width: 180px;">
        <div style="font-size: 18px; font-weight: bold; color: ${getSeverityColor(selectedEvent.magnitude)};">
          ${formatMagnitude(selectedEvent.magnitude)}
        </div>
        <div style="font-size: 13px; margin-top: 6px; color: #e2e8f0;">${selectedEvent.place}</div>
        <div style="font-size: 11px; margin-top: 8px; color: #94a3b8;">
          <div>Depth: ${selectedEvent.depth.toFixed(1)} km</div>
          <div>Time: ${formatTime(selectedEvent.time)}</div>
        </div>
      </div>
    `;

    popupRef.current = new mapboxgl.Popup({ offset: 25, closeButton: true })
      .setLngLat([selectedEvent.longitude, selectedEvent.latitude])
      .setHTML(popupContent)
      .addTo(map.current);

  }, [selectedEvent]);

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/95 backdrop-blur border border-border rounded-md p-3 text-xs space-y-2">
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

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .mapboxgl-ctrl-group {
          background: #1a2332 !important;
          border: 1px solid #2d3748 !important;
        }
        .mapboxgl-ctrl-group button {
          background: #1a2332 !important;
          color: #fff !important;
        }
        .mapboxgl-ctrl-group button:hover {
          background: #2d3748 !important;
        }
        .mapboxgl-popup-close-button {
          color: #fff !important;
          font-size: 18px !important;
          right: 6px !important;
          top: 6px !important;
        }
      `}</style>
    </div>
  );
}
