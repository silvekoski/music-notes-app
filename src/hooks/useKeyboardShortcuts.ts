import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onNewCard?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onNewCard,
  onSearch,
  onEscape,
}: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + N: New Card
      if (modifierKey && event.key === 'n') {
        event.preventDefault();
        onNewCard?.();
      }

      // Cmd/Ctrl + K: Focus Search
      if (modifierKey && event.key === 'k') {
        event.preventDefault();
        onSearch?.();
      }

      // Escape: Close modals/popovers
      if (event.key === 'Escape') {
        onEscape?.();
      }
    },
    [onNewCard, onSearch, onEscape]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
