import { EarthquakeEvent, SeverityLevel, USGSFeature, USGSResponse } from '@/types/earthquake';

export function getSeverityLevel(magnitude: number): SeverityLevel {
  if (magnitude >= 5.0) return 'critical';
  if (magnitude >= 3.0) return 'moderate';
  return 'minor';
}

export function getSeverityColor(magnitude: number): string {
  const severity = getSeverityLevel(magnitude);
  switch (severity) {
    case 'critical': return 'hsl(0, 72%, 51%)';
    case 'moderate': return 'hsl(38, 92%, 50%)';
    case 'minor': return 'hsl(187, 85%, 53%)';
  }
}

export function formatMagnitude(magnitude: number): string {
  return `M${magnitude.toFixed(1)}`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatEnergy(magnitude: number): string {
  // Energy in joules: E = 10^(1.5*M + 4.8)
  const energyJoules = Math.pow(10, 1.5 * magnitude + 4.8);
  // Convert to kilotons of TNT (1 kiloton = 4.184 × 10^12 joules)
  const energyKT = energyJoules / (4.184 * Math.pow(10, 12));
  
  if (energyKT < 0.01) {
    return `${(energyKT * 1000).toFixed(2)} T`;
  }
  return `${energyKT.toFixed(2)} KT`;
}

export function parseUSGSResponse(data: USGSResponse): EarthquakeEvent[] {
  return data.features.map((feature: USGSFeature) => ({
    id: feature.id,
    magnitude: feature.properties.mag || 0,
    place: feature.properties.place || 'Unknown location',
    time: feature.properties.time,
    depth: feature.geometry.coordinates[2],
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
    url: feature.properties.url,
    felt: feature.properties.felt,
    tsunami: feature.properties.tsunami,
  }));
}

export function getMarkerSize(magnitude: number): number {
  const baseSize = 8;
  const scale = Math.max(1, magnitude / 2);
  return baseSize * scale;
}
