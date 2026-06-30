import { useState } from 'react';
import { Card } from '@/types';
import { Pencil, MoreHorizontal, GripVertical, Music, Image, Video, Trash2, Play, Check, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { InlineAudioPlayer } from '@/components/media/InlineAudioPlayer';
import { MediaLightbox } from '@/components/media/MediaLightbox';

interface BoardCardProps {
  card: Card;
  onEdit: () => void;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  selectionMode?: boolean;
}

const attachmentIcons = {
  audio: Music,
  image: Image,
  video: Video,
};

export function BoardCard({ card, onEdit, isDragging, isSelected, onSelect, selectionMode }: BoardCardProps) {
  const { boardSettings, deleteCard } = useAppStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const aspectRatioClass = {
    '4:5': 'aspect-[4/5]',
    '1:1': 'aspect-square',
    '5:4': 'aspect-[5/4]',
  }[boardSettings.aspectRatio];

  const AttachmentIcon = card.attachmentMeta?.type
    ? attachmentIcons[card.attachmentMeta.type]
    : null;

  const hasMediaPreview = card.attachmentUrl && card.attachmentMeta;
  const isImage = card.attachmentMeta?.type === 'image';
  const isVideo = card.attachmentMeta?.type === 'video';
  const isAudio = card.attachmentMeta?.type === 'audio';

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode && onSelect) {
      e.stopPropagation();
      onSelect();
    } else {
      onEdit();
    }
  };

  const handleMediaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((isImage || isVideo) && card.attachmentUrl) {
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          'group relative bg-card border transition-all duration-200 overflow-hidden',
          aspectRatioClass,
          boardSettings.removeCornerRadius ? 'rounded-none' : 'rounded-lg',
          isDragging ? 'opacity-70 scale-105 shadow-xl ring-2 ring-primary' : 'hover:border-ring hover:shadow-md',
          isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-border',
          'cursor-grab active:cursor-grabbing'
        )}
      >
        {/* Media Background - Image */}
        {hasMediaPreview && isImage && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={card.attachmentUrl}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            {/* Fullscreen button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleMediaClick}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Media Background - Video */}
        {hasMediaPreview && isVideo && (
          <div className="absolute inset-0 w-full h-full">
            <video
              src={card.attachmentUrl}
              className="w-full h-full object-cover"
              muted
            />
            {/* Play overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center bg-background/20 cursor-pointer"
              onClick={handleMediaClick}
            >
              <div className="p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                <Play className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Overlay for media cards */}
        {hasMediaPreview && (isImage || isVideo) && !boardSettings.hideCardTitles && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
        )}

        {/* Selection Indicator */}
        {selectionMode && (
          <div
            className={cn(
              'absolute left-2 top-2 z-20 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors',
              isSelected
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-muted-foreground bg-background/80'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>
        )}

        {/* Drag Handle */}
        {!selectionMode && (
          <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {/* Card Actions */}
        <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteCard(card.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card Content */}
        <div 
          className={cn(
            'flex flex-col h-full p-4 pt-8 relative z-[1]',
            hasMediaPreview && (isImage || isVideo) && 'justify-end'
          )}
          onClick={handleClick}
        >
          {/* Audio Player - Inline */}
          {hasMediaPreview && isAudio && card.attachmentUrl && (
            <div className="mb-3 bg-muted/50 rounded-md p-3">
              <InlineAudioPlayer 
                url={card.attachmentUrl} 
                duration={card.attachmentMeta?.duration}
              />
            </div>
          )}

          {/* Attachment Icon (for non-media cards with attachment meta) */}
          {AttachmentIcon && !hasMediaPreview && (
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <AttachmentIcon className="h-4 w-4" />
              <span className="text-xs uppercase">{card.attachmentMeta?.type}</span>
              {card.attachmentMeta?.duration && (
                <span className="text-xs">{card.attachmentMeta.duration}</span>
              )}
            </div>
          )}

          {/* Title */}
          {!boardSettings.hideCardTitles && (
            <h3 className={cn(
              'font-medium text-card-foreground mb-1 line-clamp-2',
              hasMediaPreview && (isImage || isVideo) && 'text-foreground drop-shadow-sm'
            )}>
              {card.title}
            </h3>
          )}

          {/* Short Note */}
          {card.shortNote && (!boardSettings.hideCardTitles || !hasMediaPreview) && (
            <p className={cn(
              'text-sm text-muted-foreground line-clamp-2',
              !hasMediaPreview && 'mb-auto'
            )}>
              {card.shortNote}
            </p>
          )}
        </div>
      </div>

      {/* Lightbox for fullscreen view */}
      {(isImage || isVideo) && card.attachmentUrl && (
        <MediaLightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          type={card.attachmentMeta?.type as 'image' | 'video'}
          url={card.attachmentUrl}
          title={card.title}
        />
      )}
    </>
  );
}