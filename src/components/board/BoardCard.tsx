import { useState } from 'react';
import { Card } from '@/types';
import { Pencil, MoreHorizontal, Music, Image, Video, Trash2, Check } from 'lucide-react';
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

function formatRelativeTime(date: Date | string) {
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

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
  const isMediaBackground = hasMediaPreview && (isImage || isVideo);

  const visibleTags = card.tags?.slice(0, 2) ?? [];
  const extraTagCount = (card.tags?.length ?? 0) - visibleTags.length;

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
          'group relative flex flex-col bg-card border transition-colors duration-200 overflow-hidden',
          aspectRatioClass,
          boardSettings.removeCornerRadius ? 'rounded-none' : 'rounded',
          isDragging ? 'opacity-70 ring-2 ring-primary' : !boardSettings.hideCardBorders && 'hover:border-ring',
          isSelected
            ? 'border-primary ring-2 ring-primary/50'
            : boardSettings.hideCardBorders
            ? 'border-transparent'
            : 'border-border',
          'cursor-grab active:cursor-grabbing'
        )}
        onClick={handleClick}
      >
        {/* Media Background - Image */}
        {isImage && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={card.attachmentUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'}
              alt={card.title || 'Card image'}
              loading="lazy"
              className="w-full h-full object-cover bg-muted"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 bg-background hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleMediaClick}
            >
              Open
            </Button>
          </div>
        )}

        {/* Media Background - Video */}
        {isVideo && (
          <div className="absolute inset-0 w-full h-full">
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Video</span>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handleMediaClick}
            >
              <div className="px-3 py-1 rounded bg-background hover:bg-background transition-colors text-xs text-foreground">
                Play
              </div>
            </div>
          </div>
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

        {/* Header: meta label (left) + actions (right) */}
        <div
          className={cn(
            'relative z-10 flex items-center justify-between gap-2 px-3 pt-3',
            isMediaBackground && 'pointer-events-none'
          )}
        >
          {/* Left: attachment type */}
          <div className="flex items-center gap-1.5 min-h-6 text-muted-foreground">
            {AttachmentIcon && !isMediaBackground && (
              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide">
                <AttachmentIcon className="h-3.5 w-3.5" />
                {card.attachmentMeta?.type}
              </span>
            )}
          </div>

          {/* Right: actions on hover */}
          {!selectionMode && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-background/90 hover:bg-background"
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
                    className="h-7 w-7 bg-background/90 hover:bg-background"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
          )}
        </div>

        {/* Scrim for readability over media */}
        {isMediaBackground && !boardSettings.hideCardTitles && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        )}

        {/* Body */}
        <div
          className={cn(
            'relative z-[1] flex flex-1 flex-col px-3 pt-2 min-h-0',
            isMediaBackground && 'justify-end pb-3'
          )}
        >
          {/* Audio Player - Inline */}
          {isAudio && card.attachmentUrl && (
            <div className="mb-3 bg-muted rounded p-3">
              <InlineAudioPlayer
                url={card.attachmentUrl}
                duration={card.attachmentMeta?.duration}
              />
            </div>
          )}

          {/* Title */}
          {!boardSettings.hideCardTitles && (
            <h3
              className={cn(
                'font-medium leading-snug line-clamp-2',
                isMediaBackground ? 'text-white' : 'text-card-foreground'
              )}
            >
              {card.title}
            </h3>
          )}

          {/* Short Note */}
          {card.shortNote && (!boardSettings.hideCardTitles || !isMediaBackground) && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {card.shortNote}
            </p>
          )}
        </div>

        {/* Footer: tags + timestamp */}
        {!isMediaBackground && (visibleTags.length > 0 || card.updatedAt) && (
          <div className="relative z-[1] mt-auto flex items-center justify-between gap-2 px-3 pb-3 pt-2">
            <div className="flex items-center gap-1 overflow-hidden">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground truncate max-w-20"
                >
                  {tag}
                </span>
              ))}
              {extraTagCount > 0 && (
                <span className="text-[10px] text-muted-foreground shrink-0">
                  +{extraTagCount}
                </span>
              )}
            </div>
            {card.updatedAt && (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatRelativeTime(card.updatedAt)}
              </span>
            )}
          </div>
        )}
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
