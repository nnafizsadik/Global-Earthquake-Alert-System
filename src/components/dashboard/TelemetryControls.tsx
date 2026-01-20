import { TelemetryFilters } from '@/types/earthquake';
import { formatEnergy } from '@/lib/earthquake-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TelemetryControlsProps {
  filters: TelemetryFilters;
  onFiltersChange: (filters: TelemetryFilters) => void;
  onInitiateScan: () => void;
  eventCount: number;
  maxMagnitude: number;
  isLoading: boolean;
}

export function TelemetryControls({
  filters,
  onFiltersChange,
  onInitiateScan,
  eventCount,
  maxMagnitude,
  isLoading,
}: TelemetryControlsProps) {
  const energyRelease = formatEnergy(maxMagnitude);

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col gap-4 p-4 overflow-y-auto scrollbar-thin">
      <div className="panel">
        <div className="panel-header">Telemetry Controls</div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
              Data Source
            </label>
            <Select
              value={filters.dataSource}
              onValueChange={(value) => onFiltersChange({ ...filters, dataSource: value })}
            >
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usgs">USGS (Global Standard)</SelectItem>
                <SelectItem value="iris">IRIS</SelectItem>
                <SelectItem value="custom">Custom Uplink</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                Min Mag (Richter)
              </label>
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={filters.minMagnitude}
                onChange={(e) => onFiltersChange({ ...filters, minMagnitude: parseFloat(e.target.value) || 0 })}
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                Geo Filter
              </label>
              <Select
                value={filters.geoFilter}
                onValueChange={(value) => onFiltersChange({ ...filters, geoFilter: value })}
              >
                <SelectTrigger className="w-full bg-input border-border">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">All Countries (Global)</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
                  <SelectItem value="asia">Asia-Pacific</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            onClick={onInitiateScan}
            disabled={isLoading}
            className="btn-scan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Scanning...' : 'Initiate Scan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="kpi-card">
          <div className="kpi-label">Event Count</div>
          <div className="kpi-value">{eventCount}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Max Magnitude</div>
          <div className={maxMagnitude >= 5 ? 'kpi-value-critical' : 'kpi-value'}>
            {maxMagnitude.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">Est. Energy Release (TNT)</div>
        <div className="kpi-value text-primary">{energyRelease}</div>
      </div>
    </aside>
  );
}
