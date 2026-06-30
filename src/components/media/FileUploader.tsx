import { useCallback, useState } from 'react';
import { Upload, X, File, Image, Music, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File, dataUrl: string, meta: FileMeta) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export interface FileMeta {
  type: 'image' | 'audio' | 'video';
  format: string;
  size: string;
  duration?: string;
  width?: number;
  height?: number;
}

const getFileType = (file: File): 'image' | 'audio' | 'video' | null => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return null;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function FileUploader({
  onFileSelect,
  accept = 'image/*,audio/*,video/*',
  maxSize = 50,
  className,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    const fileType = getFileType(file);
    if (!fileType) {
      setError('Unsupported file type. Please upload an image, audio, or video file.');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      
      const meta: FileMeta = {
        type: fileType,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: formatFileSize(file.size),
      };

      // Get additional metadata based on file type
      if (fileType === 'image') {
        const img = new window.Image();
        img.onload = () => {
          meta.width = img.naturalWidth;
          meta.height = img.naturalHeight;
          onFileSelect(file, dataUrl, meta);
        };
        img.src = dataUrl;
      } else if (fileType === 'audio' || fileType === 'video') {
        const mediaElement = document.createElement(fileType === 'audio' ? 'audio' : 'video');
        mediaElement.onloadedmetadata = () => {
          meta.duration = formatDuration(mediaElement.duration);
          if (fileType === 'video') {
            meta.width = (mediaElement as HTMLVideoElement).videoWidth;
            meta.height = (mediaElement as HTMLVideoElement).videoHeight;
          }
          onFileSelect(file, dataUrl, meta);
        };
        mediaElement.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  }, [maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  }, [processFile]);

  return (
    <div className={className}>
      <label
        className={cn(
          'flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-ring hover:bg-muted/30',
          error && 'border-destructive'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileInput}
        />
        
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-muted">
            <Image className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="p-2 rounded-full bg-muted">
            <Music className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="p-2 rounded-full bg-muted">
            <Video className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <Upload className="h-8 w-8 text-muted-foreground mb-3" />
        
        <p className="text-sm text-muted-foreground mb-1">
          {isDragging ? 'Drop file here' : 'Click or drag to upload'}
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSize}MB
        </p>
      </label>

      {error && (
        <p className="text-sm text-destructive mt-2 flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
