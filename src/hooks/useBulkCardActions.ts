import { useState, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

export function useBulkCardActions() {
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const { deleteCard, updateCard } = useAppStore();

  const toggleCardSelection = useCallback((cardId: string) => {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }, []);

  const selectAll = useCallback((cardIds: string[]) => {
    setSelectedCardIds(new Set(cardIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCardIds(new Set());
  }, []);

  const deleteSelected = useCallback(() => {
    const count = selectedCardIds.size;
    selectedCardIds.forEach((id) => deleteCard(id));
    clearSelection();
    toast.success(`Deleted ${count} card${count !== 1 ? 's' : ''}`);
  }, [selectedCardIds, deleteCard, clearSelection]);

  const addTagToSelected = useCallback((tagName: string) => {
    selectedCardIds.forEach((id) => {
      const card = useAppStore.getState().cards.find((c) => c.id === id);
      if (card && !card.tags.includes(tagName)) {
        updateCard(id, { tags: [...card.tags, tagName] });
      }
    });
    toast.success(`Added tag "${tagName}" to ${selectedCardIds.size} card${selectedCardIds.size !== 1 ? 's' : ''}`);
  }, [selectedCardIds, updateCard]);

  const removeTagFromSelected = useCallback((tagName: string) => {
    selectedCardIds.forEach((id) => {
      const card = useAppStore.getState().cards.find((c) => c.id === id);
      if (card) {
        updateCard(id, { tags: card.tags.filter((t) => t !== tagName) });
      }
    });
    toast.success(`Removed tag "${tagName}" from ${selectedCardIds.size} card${selectedCardIds.size !== 1 ? 's' : ''}`);
  }, [selectedCardIds, updateCard]);

  return {
    selectedCardIds,
    toggleCardSelection,
    selectAll,
    clearSelection,
    deleteSelected,
    addTagToSelected,
    removeTagFromSelected,
    isSelected: (cardId: string) => selectedCardIds.has(cardId),
    selectionCount: selectedCardIds.size,
  };
}
