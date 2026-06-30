import { X, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioWaveform } from './AudioWaveform';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  type: 'image' | 'audio' | 'video';
  url: string;
  format: string;
  size: string;
  duration?: string;
  width?: number;
  height?: number;
  onDelete?: () => void;
  className?: string;
  compact?: boolean;
}

export function MediaPreview({
  type,
  url,
  format,
  size,
  duration,
  width,
  height,
  onDelete,
  className,
  compact = false,
}: MediaPreviewProps) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `media.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      {/* Media Content */}
      <div className="relative">
        {type === 'image' && (
          <img
            src={url}
            alt="Uploaded media"
            className={cn(
              'w-full object-cover',
              compact ? 'max-h-32' : 'max-h-64'
            )}
          />
        )}

        {type === 'video' && (
          <video
            src={url}
            controls
            className={cn(
              'w-full',
              compact ? 'max-h-32' : 'max-h-64'
            )}
          />
        )}

        {type === 'audio' && (
          <div className={cn('p-4', compact && 'p-2')}>
            <AudioWaveform audioUrl={url} compact={compact} />
          </div>
        )}
      </div>

      {/* Metadata & Actions */}
      <div className="p-3 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="uppercase text-xs">
            {format}
          </Badge>
          <span className="text-xs text-muted-foreground">{size}</span>
          {duration && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{duration}</span>
            </>
          )}
          {width && height && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {width}×{height}
              </span>
            </>
          )}
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
