import { useState, useCallback, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAppStore } from '@/stores/appStore';
import { BoardCard } from './BoardCard';
import { BulkActionsBar } from './BulkActionsBar';
import { BoardSettingsPanel } from './BoardSettingsPanel';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';
import { useBulkCardActions } from '@/hooks/useBulkCardActions';
import { LiveCursors } from '@/components/collaboration/LiveCursors';
import { useCollaborationStore } from '@/stores/collaborationStore';
import { getCollaborator } from '@/lib/collaborators';

import { Card } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, SquarePlus, Navigation, X } from 'lucide-react';

interface BoardGridProps {
  onNewCard?: () => void;
}

export function BoardGrid({ onNewCard }: BoardGridProps) {
  const { cards, selectedBoardId, searchQuery, selectedTags, boardSettings, tags: allTags, updateCard, addCard, boards } = useAppStore();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  // Collaboration presence
  const followingId = useCollaborationStore((s) => s.followingId);
  const clearFollow = useCollaborationStore((s) => s.clearFollow);
  const setBoardBounds = useCollaborationStore((s) => s.setBoardBounds);
  const followedCursor = useCollaborationStore((s) =>
    followingId ? s.presence[followingId]?.cursor ?? null : null
  );
  const followedCollaborator = getCollaborator(followingId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);

  const {
    selectedCardIds,
    toggleCardSelection,
    selectAll,
    clearSelection,
    deleteSelected,
    addTagToSelected,
    removeTagFromSelected,
    isSelected,
    selectionCount,
  } = useBulkCardActions();

  const boardCards = cards.filter((card) => card.boardId === selectedBoardId);

  // Sort by position for consistent ordering
  const sortedBoardCards = [...boardCards].sort((a, b) => {
    const posA = (a.position?.y ?? 0) * boardSettings.gridWidth + (a.position?.x ?? 0);
    const posB = (b.position?.y ?? 0) * boardSettings.gridWidth + (b.position?.x ?? 0);
    return posA - posB;
  });

  // Filter cards based on search and tags
  const filteredCards = sortedBoardCards.filter((card) => {
    const matchesSearch =
      !searchQuery ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.shortNote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const selectedTagNames = allTags
      .filter((t) => selectedTags.includes(t.id))
      .map((t) => t.name);

    const matchesTags =
      selectedTagNames.length === 0 ||
      selectedTagNames.some((tagName) => card.tags.includes(tagName));

    return matchesSearch && matchesTags;
  });

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    // Create reordered array
    const reorderedCards = [...filteredCards];
    const [movedCard] = reorderedCards.splice(sourceIndex, 1);
    reorderedCards.splice(destIndex, 0, movedCard);

    // Update positions for all affected cards
    reorderedCards.forEach((card, index) => {
      const row = Math.floor(index / boardSettings.gridWidth);
      const col = index % boardSettings.gridWidth;
      updateCard(card.id, { position: { x: col, y: row } });
    });
  }, [filteredCards, boardSettings.gridWidth, updateCard]);

  const handleToggleSelectionMode = () => {
    if (selectionMode) {
      clearSelection();
    }
    setSelectionMode(!selectionMode);
  };

  const handleSelectAll = () => {
    selectAll(filteredCards.map((c) => c.id));
  };

  const handleAddBlank = () => {
    if (!selectedBoardId) return;
    const index = boardCards.length;
    const blankCard: Card = {
      id: crypto.randomUUID(),
      boardId: selectedBoardId,
      title: 'Untitled',
      tags: [],
      position: {
        x: index % boardSettings.gridWidth,
        y: Math.floor(index / boardSettings.gridWidth),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addCard(blankCard);
  };

  // Report board-content bounds to the collaboration store so simulated cursors
  // stay within the actual board region.
  useEffect(() => {
    const el = boardContentRef.current;
    if (!el) return;
    const update = () => setBoardBounds({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [setBoardBounds, selectedBoardId, filteredCards.length]);

  // Follow mode: keep the followed collaborator's cursor comfortably in view.
  useEffect(() => {
    if (!followingId || !followedCursor) return;
    const scroller = scrollRef.current;
    const content = boardContentRef.current;
    if (!scroller || !content) return;
    const contentTop =
      content.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    const cursorY = followedCursor.y + contentTop;
    const margin = 120;
    const viewTop = scroller.scrollTop;
    const viewBottom = viewTop + scroller.clientHeight;
    if (cursorY < viewTop + margin || cursorY > viewBottom - margin) {
      scroller.scrollTo({ top: Math.max(0, cursorY - scroller.clientHeight / 2), behavior: 'smooth' });
    }
  }, [followingId, followedCursor]);

  // Esc exits follow mode.
  useEffect(() => {
    if (!followingId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearFollow();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [followingId, clearFollow]);

  // Generate empty placeholder slots
  const totalSlots = boardSettings.gridWidth * (Math.ceil(filteredCards.length / boardSettings.gridWidth) + boardSettings.extraEmptyRows);
  const emptySlots = Math.max(0, totalSlots - filteredCards.length);

  return (
    <>
      {/* Follow mode banner */}
      {followingId && followedCollaborator && (
        <div
          className="fixed left-1/2 top-16 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{ backgroundColor: followedCollaborator.color }}
        >
          <Navigation className="h-3.5 w-3.5" />
          Following {followedCollaborator.name}
          <span className="opacity-80">(press Esc to exit)</span>
          <button
            type="button"
            onClick={clearFollow}
            className="ml-1 rounded-full p-0.5 hover:bg-white/20"
            aria-label="Stop following"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto p-6">
        {/* Helper hint */}
        {boardCards.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">No cards yet</p>
              <p className="text-sm">Click "New Card" to create your first idea</p>
            </div>
          </div>
        )}

        {boardCards.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <h2 className="text-lg font-medium text-foreground">
                {boards.find((b) => b.id === selectedBoardId)?.name || 'Select a board'}
              </h2>

              <div className="flex items-center gap-2">
                <BoardSettingsPanel />
                {selectionMode && (
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                )}
                <Button
                  variant={selectionMode ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={handleToggleSelectionMode}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  {selectionMode ? 'Done' : 'Select'}
                </Button>
                {boardSettings.freeGridMovement && (
                  <Button variant="outline" size="sm" onClick={handleAddBlank} className="gap-2">
                    <SquarePlus className="h-4 w-4" />
                    Add Blank
                  </Button>
                )}
                {onNewCard && (
                  <Button size="sm" onClick={onNewCard} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Card
                  </Button>
                )}
              </div>
            </div>

            <div ref={boardContentRef} className="relative">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="board" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn('grid', !boardSettings.removeCardSpacing && 'gap-4')}
                    style={{
                      gridTemplateColumns: `repeat(${boardSettings.gridWidth}, minmax(0, 1fr))`,
                      gap: boardSettings.removeCardSpacing ? '0px' : undefined,
                    }}
                  >
                    {filteredCards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                        isDragDisabled={selectionMode}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <BoardCard
                              card={card}
                              onEdit={() => handleEditCard(card)}
                              isDragging={snapshot.isDragging}
                              isSelected={isSelected(card.id)}
                              onSelect={() => toggleCardSelection(card.id)}
                              selectionMode={selectionMode}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Empty placeholder slots */}
                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className={cn(
                          'border border-border transition-colors',
                          boardSettings.removeCornerRadius ? 'rounded-none' : 'rounded',
                          {
                            'aspect-[4/5]': boardSettings.aspectRatio === '4:5',
                            'aspect-square': boardSettings.aspectRatio === '1:1',
                            'aspect-[5/4]': boardSettings.aspectRatio === '5:4',
                          }
                        )}
                      />
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
              <LiveCursors />
            </div>
          </>
        )}
      </div>

      <BulkActionsBar
        selectionCount={selectionCount}
        onClear={() => {
          clearSelection();
          setSelectionMode(false);
        }}
        onDelete={deleteSelected}
        onAddTag={addTagToSelected}
        onRemoveTag={removeTagFromSelected}
      />

      <CardDetailsModal
        open={modalOpen}
        onOpenChange={handleCloseModal}
        card={selectedCard}
      />
    </>
  );
}
