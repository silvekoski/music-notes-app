import { useState, useEffect, useCallback } from 'react';
import { FileText, MessageCircle, Send, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card as CardType, Comment } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { FileUploader, FileMeta } from '@/components/media/FileUploader';
import { MediaPreview } from '@/components/media/MediaPreview';

interface CardDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardType | null;
  isNew?: boolean;
}

export function CardDetailsModal({ open, onOpenChange, card, isNew = false }: CardDetailsModalProps) {
  const { updateCard, addCard, tags: allTags, selectedBoardId, user, addComment, comments } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [shortNote, setShortNote] = useState('');
  const [tags, setTagsState] = useState<string[]>([]);
  const [attachmentType, setAttachmentType] = useState<'file' | 'markdown'>('markdown');
  const [content, setContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>();
  const [attachmentMeta, setAttachmentMeta] = useState<CardType['attachmentMeta'] | undefined>();

  const cardComments = card ? comments.filter(c => c.cardId === card.id) : [];

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setShortNote(card.shortNote || '');
      setTagsState(card.tags);
      setAttachmentType(card.attachmentType || 'markdown');
      setContent(card.content || '');
      setAttachmentUrl(card.attachmentUrl);
      setAttachmentMeta(card.attachmentMeta);
    } else {
      setTitle('');
      setShortNote('');
      setTagsState([]);
      setAttachmentType('markdown');
      setContent('');
      setAttachmentUrl(undefined);
      setAttachmentMeta(undefined);
    }
  }, [card, open]);

  const handleFileSelect = (file: File, dataUrl: string, meta: FileMeta) => {
    setAttachmentUrl(dataUrl);
    setAttachmentMeta(meta);
    if (card && !isNew) {
      updateCard(card.id, { attachmentUrl: dataUrl, attachmentMeta: meta });
    }
  };

  const handleDeleteAttachment = () => {
    setAttachmentUrl(undefined);
    setAttachmentMeta(undefined);
    if (card && !isNew) {
      updateCard(card.id, { attachmentUrl: undefined, attachmentMeta: undefined });
    }
  };

  const generateRandomTags = (): string[] => {
    const pool = ['inspiration', 'demo', 'lyrics', 'melody', 'reference', 'mood', 'sketch', 'idea', 'sample', 'mix', 'draft', 'production'];
    const count = 1 + Math.floor(Math.random() * 3);
    const picked = new Set<string>();
    while (picked.size < count) picked.add(pool[Math.floor(Math.random() * pool.length)]);
    return Array.from(picked);
  };

  const handleSave = () => {
    const finalTags = isNew || !card ? generateRandomTags() : tags;

    if (isNew || !card) {
      if (!selectedBoardId) {
        toast.error('Please select a board first');
        onOpenChange(false);
        return;
      }
      const newCard: CardType = {
        id: crypto.randomUUID(),
        boardId: selectedBoardId,
        title: title || 'Untitled',
        shortNote: shortNote || undefined,
        content: content || undefined,
        tags: finalTags,
        attachmentType,
        attachmentUrl,
        attachmentMeta,
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addCard(newCard);
      toast.success('Card created');
    } else {
      updateCard(card.id, {
        title,
        shortNote,
        content,
        tags: finalTags,
        attachmentType,
        attachmentUrl,
        attachmentMeta,
      });
    }

    onOpenChange(false);
  };

  // Auto-save on field changes (debounced) — local only
  useEffect(() => {
    if (card && !isNew && open) {
      const timeout = setTimeout(() => {
        updateCard(card.id, { title, shortNote, content, attachmentType });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [title, shortNote, content, attachmentType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Card Details</span>
            <span className="text-xs text-muted-foreground font-normal">
              All changes are saved automatically
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title..."
            />
          </div>

          {/* Short Note */}
          <div className="space-y-2">
            <Label htmlFor="shortNote">Short Note</Label>
            <Input
              id="shortNote"
              value={shortNote}
              onChange={(e) => setShortNote(e.target.value)}
              placeholder="Add a short description..."
            />
          </div>
          {/* Tags (auto-generated, read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <span className="text-xs text-muted-foreground">Auto-generated</span>
            </div>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, i) => {
                  const existingTag = allTags.find((t) => t.name === tag);
                  return (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs"
                      style={
                        existingTag
                          ? { backgroundColor: `${existingTag.color}20`, color: existingTag.color }
                          : undefined
                      }
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Tags will be generated automatically when the card is saved.
              </p>
            )}
          </div>

          {/* Attachment Type Selector */}
          <div className="space-y-2">
            <Label>Attachment Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={attachmentType === 'file' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAttachmentType('file')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={attachmentType === 'markdown' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAttachmentType('markdown')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Markdown Note
              </Button>
            </div>
          </div>

          {/* Markdown Editor */}
          {attachmentType === 'markdown' && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes in Markdown..."
                className="min-h-[200px] text-sm"
              />
            </div>
          )}

          {/* File Upload */}
          {attachmentType === 'file' && (
            <div className="space-y-3">
              <Label>Upload</Label>
              
              {attachmentUrl && attachmentMeta ? (
                <MediaPreview
                  type={attachmentMeta.type}
                  url={attachmentUrl}
                  format={attachmentMeta.format}
                  size={attachmentMeta.size}
                  duration={attachmentMeta.duration}
                  width={attachmentMeta.width}
                  height={attachmentMeta.height}
                  onDelete={handleDeleteAttachment}
                />
              ) : (
                <FileUploader onFileSelect={handleFileSelect} />
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Comments</span>
              <Badge variant="secondary" className="text-xs">{cardComments.length}</Badge>
            </div>
            
            {cardComments.length > 0 && (
              <ScrollArea className="max-h-[200px]">
                <div className="space-y-3">
                  {cardComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.userAvatar} />
                        <AvatarFallback className="text-xs">
                          {comment.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(comment.createdAt, 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                className="min-h-[60px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!newComment.trim() || !card}
              onClick={() => {
                if (card && user && newComment.trim()) {
                  const comment: Comment = {
                    id: crypto.randomUUID(),
                    cardId: card.id,
                    userId: user.id,
                    userName: user.name || 'Anonymous',
                    userAvatar: user.avatarUrl,
                    content: newComment.trim(),
                    createdAt: new Date(),
                  };
                  addComment(comment);
                  setNewComment('');
                }
              }}
            >
              <Send className="h-3 w-3" />
              Add Comment
            </Button>
          </div>

          {/* Footer metadata */}
          {card && (
            <div className="text-xs text-muted-foreground pt-4 border-t border-border">
              Created on {format(card.createdAt, 'MMM d, yyyy')}
            </div>
          )}

          {/* Actions for new card */}
          {isNew && (
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Create Card
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
