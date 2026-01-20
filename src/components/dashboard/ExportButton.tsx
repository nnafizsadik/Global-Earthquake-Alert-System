import { Download } from 'lucide-react';
import { EarthquakeEvent } from '@/types/earthquake';
import { toast } from '@/hooks/use-toast';

interface ExportButtonProps {
  events: EarthquakeEvent[];
}

export function ExportButton({ events }: ExportButtonProps) {
  const handleExport = () => {
    if (events.length === 0) {
      toast({
        title: 'No data to export',
        description: 'Wait for events to be detected before exporting.',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['ID', 'Magnitude', 'Place', 'Time', 'Depth (km)', 'Latitude', 'Longitude'];
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        event.id,
        event.magnitude,
        `"${event.place}"`,
        new Date(event.time).toISOString(),
        event.depth,
        event.latitude,
        event.longitude,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sevrion-earthquake-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: `${events.length} events exported to CSV.`,
    });
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card hover:bg-secondary transition-colors text-sm"
    >
      <Download className="w-4 h-4" />
      <span>Export Dataset (CSV)</span>
    </button>
  );
}
