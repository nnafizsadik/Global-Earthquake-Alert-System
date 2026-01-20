import { SystemLogEntry } from '@/types/earthquake';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SystemLogProps {
  logs: SystemLogEntry[];
}

export function SystemLog({ logs }: SystemLogProps) {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="panel w-96 flex-shrink-0">
      <div className="panel-header flex items-center gap-2">
        <span className="text-muted-foreground">&gt;</span>
        System_Log
      </div>
      <ScrollArea className="h-48 p-3">
        <div className="system-log space-y-1">
          {logs.length === 0 ? (
            <div className="text-primary animate-pulse">Initializing System...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="log-timestamp whitespace-nowrap">
                  [{formatTimestamp(log.timestamp)}]
                </span>
                <span className="log-action">{log.message.split(':')[0]}:</span>
                <span className={`flex-1 ${
                  log.type === 'success' ? 'log-success' :
                  log.type === 'warning' ? 'log-warning' :
                  log.type === 'error' ? 'log-error' :
                  'log-source'
                }`}>
                  {log.source || log.message.split(':').slice(1).join(':')}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
