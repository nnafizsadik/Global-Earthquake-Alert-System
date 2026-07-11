import { EarthquakeEvent } from '@/types/earthquake';
import { getSeverityColor } from '@/lib/earthquake-utils';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DepthChartProps {
  events: EarthquakeEvent[];
}

export function DepthChart({ events }: DepthChartProps) {
  const chartData = events.map((event) => ({
    magnitude: event.magnitude,
    depth: event.depth,
    id: event.id,
    place: event.place,
  }));

  return (
    <div className="panel flex-1">
      <div className="panel-header">Sub-Surface Analysis (Depth vs Mag)</div>
      <div className="p-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 30% 20%)" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="magnitude"
              name="Magnitude"
              domain={[1.5, 7]}
              tick={{ fill: 'hsl(210 10% 50%)', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(174 30% 20%)' }}
              tickLine={{ stroke: 'hsl(174 30% 20%)' }}
              label={{ 
                value: 'Magnitude', 
                position: 'bottom', 
                fill: 'hsl(210 10% 50%)', 
                fontSize: 10,
                offset: 0
              }}
            />
            <YAxis
              type="number"
              dataKey="depth"
              name="Depth"
              reversed
              domain={[-200, 800]}
              tick={{ fill: 'hsl(210 10% 50%)', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(174 30% 20%)' }}
              tickLine={{ stroke: 'hsl(174 30% 20%)' }}
              label={{ 
                value: 'Depth (km)', 
                angle: -90, 
                position: 'insideLeft', 
                fill: 'hsl(210 10% 50%)', 
                fontSize: 10,
                offset: 10
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded p-2 text-xs">
                      <div className="font-bold text-primary">M{data.magnitude.toFixed(1)}</div>
                      <div className="text-muted-foreground">Depth: {data.depth.toFixed(1)} km</div>
                      <div className="text-foreground truncate max-w-[200px]">{data.place}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Events" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getSeverityColor(entry.magnitude)}
                  opacity={0.8}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
