export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  depth: number;
  latitude: number;
  longitude: number;
  url?: string;
  felt?: number;
  tsunami?: number;
}

export interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    felt?: number;
    tsunami?: number;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

export interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    count: number;
  };
  features: USGSFeature[];
}

export type SeverityLevel = 'critical' | 'moderate' | 'minor';

export interface SystemLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  source?: string;
}

export interface TelemetryFilters {
  dataSource: string;
  minMagnitude: number;
  geoFilter: string;
}
