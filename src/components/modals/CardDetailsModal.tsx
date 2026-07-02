import { useState, useEffect } from 'react';
import { FileText, MessageCircle, Send, Upload, Tag as TagIcon, Calendar, Clock, Paperclip, CheckCircle2 } from 'lucide-react';
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
import { useCollaborationStore } from '@/stores/collaborationStore';
import { getCollaborator } from '@/lib/collaborators';
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

  // Collaborator currently typing on this card (simulated presence).
  const typingCollaboratorId = useCollaborationStore((s) => {
    if (!s.enabled || !card) return null;
    for (const id of s.onlineIds) {
      const p = s.presence[id];
      if (p && p.editingCardId === card.id && p.isTyping) return id;
    }
    return null;
  });
  const typingCollaborator = getCollaborator(typingCollaboratorId);

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

  const handleAddComment = () => {
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
  };

  // Auto-save on field changes (debounced), local only
  useEffect(() => {
    if (card && !isNew && open) {
      const timeout = setTimeout(() => {
        updateCard(card.id, { title, shortNote, content, attachmentType });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [title, shortNote, content, attachmentType]);

  const renderTags = () => {
    if (tags.length > 0) {
      return (
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
      );
    }
    return (
      <p className="text-xs text-muted-foreground italic">
        Generated automatically on save.
      </p>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between gap-4 pr-8">
            <DialogTitle className="text-base">
              {isNew ? 'New Card' : 'Card Details'}
            </DialogTitle>
            {typingCollaborator ? (
              <span
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: typingCollaborator.color }}
              >
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" style={{ backgroundColor: typingCollaborator.color }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" style={{ backgroundColor: typingCollaborator.color }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: typingCollaborator.color }} />
                </span>
                {typingCollaborator.name} is typing…
              </span>
            ) : !isNew ? (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved automatically
              </span>
            ) : null}
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-[1fr_280px] max-h-[calc(90vh-65px)] overflow-hidden">
          {/* Main content column */}
          <ScrollArea className="max-h-[calc(90vh-65px)]">
            <div className="px-6 py-5 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs text-muted-foreground">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title..."
                  className="text-lg font-medium h-auto py-2 border-0 px-0 shadow-none focus-visible:ring-0"
                />
              </div>

              {/* Short Note */}
              <div className="space-y-2">
                <Label htmlFor="shortNote" className="text-xs text-muted-foreground">Short Note</Label>
                <Input
                  id="shortNote"
                  value={shortNote}
                  onChange={(e) => setShortNote(e.target.value)}
                  placeholder="Add a short description..."
                />
              </div>

              {/* Attachment Type Selector */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Attachment Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={attachmentType === 'markdown' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAttachmentType('markdown')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Markdown Note
                  </Button>
                  <Button
                    type="button"
                    variant={attachmentType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAttachmentType('file')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>

              {/* Markdown Editor */}
              {attachmentType === 'markdown' && (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-xs text-muted-foreground">Content</Label>
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
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Upload</Label>
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
              <div className="space-y-4 border-t border-border pt-5">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Comments</span>
                  <Badge variant="secondary" className="text-xs">{cardComments.length}</Badge>
                </div>

                {cardComments.length > 0 && (
                  <div className="space-y-4">
                    {cardComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback className="text-xs">
                            {comment.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(comment.createdAt, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 break-words">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment composer */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {(user?.name || 'A').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={card ? 'Add a comment...' : 'Save the card to add comments'}
                      className="min-h-[60px]"
                      value={newComment}
                      disabled={!card}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="gap-2"
                        disabled={!newComment.trim() || !card}
                        onClick={handleAddComment}
                      >
                        <Send className="h-3 w-3" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Metadata sidebar */}
          <aside className="border-t md:border-t-0 md:border-l border-border bg-muted/30">
            <ScrollArea className="max-h-[calc(90vh-65px)]">
              <div className="px-5 py-5 space-y-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Properties
                </p>

                {/* Tags */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TagIcon className="h-3.5 w-3.5" />
                    <span>Tags</span>
                  </div>
                  {renderTags()}
                </div>

                {/* Attachment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Attachment</span>
                  </div>
                  <p className="text-sm text-foreground capitalize">
                    {attachmentUrl && attachmentMeta
                      ? `${attachmentMeta.type} (${attachmentMeta.format})`
                      : attachmentType === 'markdown'
                        ? 'Markdown note'
                        : 'None'}
                  </p>
                </div>

                {/* Comments count */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Comments</span>
                  </div>
                  <p className="text-sm text-foreground">{cardComments.length}</p>
                </div>

                {card && (
                  <>
                    <div className="border-t border-border" />
                    {/* Created */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Created</span>
                      </div>
                      <p className="text-sm text-foreground">
                        {format(card.createdAt, 'MMM d, yyyy')}
                      </p>
                    </div>

                    {/* Updated */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Last updated</span>
                      </div>
                      <p className="text-sm text-foreground">
                        {format(card.updatedAt, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </aside>
        </div>

        {/* Footer actions */}
        {isNew && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Create Card
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
