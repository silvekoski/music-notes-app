import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  audioUrl: string;
  className?: string;
  compact?: boolean;
}

export function AudioWaveform({ audioUrl, className, compact = false }: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'hsl(var(--muted-foreground) / 0.4)',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'hsl(var(--primary))',
      barWidth: compact ? 2 : 3,
      barGap: compact ? 1 : 2,
      barRadius: 2,
      height: compact ? 40 : 80,
      normalize: true,
    });

    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
      setIsReady(true);
      wavesurfer.setVolume(volume);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => setIsPlaying(false));

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, compact]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        ref={containerRef}
        className={cn(
          'w-full rounded-md overflow-hidden bg-muted/30',
          !isReady && 'animate-pulse'
        )}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={togglePlay}
          disabled={!isReady}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <span className="text-xs text-muted-foreground min-w-[80px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {!compact && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="w-20"
            />
          </>
        )}
      </div>
    </div>
  );
}
