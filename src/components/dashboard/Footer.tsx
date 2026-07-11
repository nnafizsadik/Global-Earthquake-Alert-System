import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="px-4 py-3 border-t border-border bg-card">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} All Rights Reserved by Team Absolute Zero</span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1">
          Developed by{' '}
          <a
            href="https://nafizsadik.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Nafiz Sadik
            <ExternalLink className="w-3 h-3" />
          </a>
        </span>
      </div>
    </footer>
  );
}
