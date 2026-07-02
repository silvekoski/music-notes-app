import { useState, useRef } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BoardGrid } from '@/components/board/BoardGrid';
import { CardDetailsModal } from '@/components/modals/CardDetailsModal';
import { useAppStore } from '@/stores/appStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSimulatedPresence } from '@/hooks/useSimulatedPresence';
import { UserSettingsView } from '@/components/views/UserSettingsView';

export default function Dashboard() {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const { selectedBoardId, activeView, setActiveView } = useAppStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulated multiplayer presence (cursors, selections, activity feed).
  useSimulatedPresence();

  useKeyboardShortcuts({
    onNewCard: () => selectedBoardId && setNewCardModalOpen(true),
    onSearch: () => searchInputRef.current?.focus(),
    onEscape: () => setNewCardModalOpen(false),
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <TopBar searchInputRef={searchInputRef} />

          {activeView === 'userSettings' ? (
            <UserSettingsView onClose={() => setActiveView('board')} />
          ) : selectedBoardId ? (
            <BoardGrid onNewCard={() => setNewCardModalOpen(true)} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">Select a board to get started</p>
                <p className="text-sm text-muted-foreground/70">
                  Use <kbd className="px-1.5 py-0.5 text-xs rounded bg-muted border border-border">⌘K</kbd> to search
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CardDetailsModal
        open={newCardModalOpen}
        onOpenChange={setNewCardModalOpen}
        card={null}
        isNew
      />
    </SidebarProvider>
  );
}
