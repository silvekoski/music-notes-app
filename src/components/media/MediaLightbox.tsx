import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MediaLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'image' | 'video';
  url: string;
  title?: string;
}

export function MediaLightbox({ open, onOpenChange, type, url, title }: MediaLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) {
      setZoom(1);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [open]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (value[0] / 100) * videoRef.current.duration;
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background border border-border">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-50 bg-background hover:bg-background"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {type === 'image' && (
          <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh] overflow-auto p-4">
            {/* Zoom controls */}
            <div className="absolute left-2 top-2 z-50 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background hover:bg-background"
                onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-background hover:bg-background"
                onClick={() => setZoom(z => Math.min(3, z + 0.25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <div
              className="bg-muted flex items-center justify-center max-w-full w-[60vw] h-[70vh] transition-transform duration-200 rounded"
              style={{ transform: `scale(${zoom})` }}
            >
              <span className="text-sm text-muted-foreground">Image</span>
            </div>
          </div>
        )}

        {type === 'video' && (
          <div className="relative flex flex-col items-center justify-center min-h-[50vh]">
            <video
              ref={videoRef}
              src={url}
              className="hidden"
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              muted={isMuted}
            />
            <div
              className="bg-muted flex items-center justify-center w-[60vw] max-w-full h-[60vh] rounded cursor-pointer"
              onClick={togglePlay}
            >
              <span className="text-sm text-muted-foreground">Video</span>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <span className="text-xs text-muted-foreground w-12">
                  {formatTime((progress / 100) * duration)}
                </span>

                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="flex-1"
                  onValueChange={handleSeek}
                />

                <span className="text-xs text-muted-foreground w-12 text-right">
                  {formatTime(duration)}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border pointer-events-none">
            <p className="text-sm font-medium text-foreground">{title}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
