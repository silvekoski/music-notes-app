import { create } from 'zustand';
import { Collaborator, PresenceState } from '@/types';
import { MOCK_COLLABORATORS } from '@/lib/collaborators';

interface BoardBounds {
  width: number;
  height: number;
}

interface CardPresence {
  selecting: Collaborator[];
  editing: Collaborator[];
}

interface CollaborationState {
  collaborators: Collaborator[];
  presence: Record<string, PresenceState>;
  onlineIds: string[];
  followingId: string | null;
  enabled: boolean;
  boardBounds: BoardBounds;

  // Actions
  setPresence: (id: string, updates: Partial<PresenceState>) => void;
  setOnlineIds: (ids: string[]) => void;
  toggleFollow: (id: string) => void;
  clearFollow: () => void;
  setEnabled: (enabled: boolean) => void;
  setBoardBounds: (bounds: BoardBounds) => void;

  // Selectors
  getOnlineCollaborators: () => Collaborator[];
  getPresenceForCard: (cardId: string) => CardPresence;
}

const initialPresence: Record<string, PresenceState> = Object.fromEntries(
  MOCK_COLLABORATORS.map((c) => [
    c.id,
    {
      collaboratorId: c.id,
      cursor: null,
      selectedCardId: null,
      editingCardId: null,
      isTyping: false,
      lastActive: Date.now(),
    } as PresenceState,
  ])
);

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  collaborators: MOCK_COLLABORATORS,
  presence: initialPresence,
  onlineIds: MOCK_COLLABORATORS.slice(0, 3).map((c) => c.id),
  followingId: null,
  enabled: true,
  boardBounds: { width: 0, height: 0 },

  setPresence: (id, updates) =>
    set((state) => ({
      presence: {
        ...state.presence,
        [id]: { ...state.presence[id], ...updates },
      },
    })),

  setOnlineIds: (ids) => set({ onlineIds: ids }),

  toggleFollow: (id) =>
    set((state) => ({ followingId: state.followingId === id ? null : id })),

  clearFollow: () => set({ followingId: null }),

  setEnabled: (enabled) =>
    set((state) => ({
      enabled,
      followingId: enabled ? state.followingId : null,
    })),

  setBoardBounds: (bounds) => set({ boardBounds: bounds }),

  getOnlineCollaborators: () => {
    const { collaborators, onlineIds } = get();
    return collaborators.filter((c) => onlineIds.includes(c.id));
  },

  getPresenceForCard: (cardId) => {
    const { collaborators, presence, onlineIds } = get();
    const selecting: Collaborator[] = [];
    const editing: Collaborator[] = [];
    for (const c of collaborators) {
      if (!onlineIds.includes(c.id)) continue;
      const p = presence[c.id];
      if (!p) continue;
      if (p.editingCardId === cardId) editing.push(c);
      else if (p.selectedCardId === cardId) selecting.push(c);
    }
    return { selecting, editing };
  },
}));
