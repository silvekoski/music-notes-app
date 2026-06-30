import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '@/lib/utils';

interface CardWaveformProps {
  audioUrl: string;
  className?: string;
}

export function CardWaveform({ audioUrl, className }: CardWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'hsl(var(--muted-foreground) / 0.5)',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 48,
      normalize: true,
      interact: false,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.load(audioUrl);
    
    wavesurfer.on('ready', () => {
      setIsReady(true);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full transition-opacity',
        isReady ? 'opacity-100' : 'opacity-50',
        className
      )}
    />
  );
}
