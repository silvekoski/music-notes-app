import { useEffect, useRef } from 'react';
import { useCollaborationStore } from '@/stores/collaborationStore';
import { useAppStore } from '@/stores/appStore';
import { MOCK_COLLABORATORS } from '@/lib/collaborators';
import { Activity } from '@/types';

type Target = { x: number; y: number };

const MOVE_FPS = 30;
const BEHAVIOR_MS = 2600;
const PRESENCE_FLIP_MS = 9000;

function randomPoint(width: number, height: number): Target {
  // Keep targets slightly inset so cursors never sit exactly on the edge.
  const pad = 24;
  return {
    x: pad + Math.random() * Math.max(1, width - pad * 2),
    y: pad + Math.random() * Math.max(1, height - pad * 2),
  };
}

/**
 * Simulated multiplayer presence. Runs once at app root while the dashboard is
 * mounted: eases fake collaborators' cursors around the board, randomly
 * selects/edits cards, toggles typing, flips people online/offline, and feeds
 * the activity log. Pure front-end, no network.
 */
export function useSimulatedPresence() {
  const targetsRef = useRef<Record<string, Target>>({});
  const lastActivityRef = useRef<number>(0);

  useEffect(() => {
    const collab = useCollaborationStore;
    const app = useAppStore;

    // Seed initial cursor positions + targets.
    const seed = () => {
      const { boardBounds } = collab.getState();
      const w = boardBounds.width || 800;
      const h = boardBounds.height || 600;
      for (const c of MOCK_COLLABORATORS) {
        if (!targetsRef.current[c.id]) targetsRef.current[c.id] = randomPoint(w, h);
      }
    };
    seed();

    let moveTimer: ReturnType<typeof setInterval> | null = null;
    let behaviorTimer: ReturnType<typeof setInterval> | null = null;
    let flipTimer: ReturnType<typeof setInterval> | null = null;

    // --- Cursor easing loop (throttled) ---
    const move = () => {
      const state = collab.getState();
      if (!state.enabled) return;
      const { boardBounds, onlineIds, presence } = state;
      const w = boardBounds.width || 800;
      const h = boardBounds.height || 600;

      const nextPresence = { ...presence };
      let changed = false;

      for (const c of MOCK_COLLABORATORS) {
        const p = nextPresence[c.id];
        if (!p) continue;
        if (!onlineIds.includes(c.id)) {
          if (p.cursor !== null) {
            nextPresence[c.id] = { ...p, cursor: null };
            changed = true;
          }
          continue;
        }

        let target = targetsRef.current[c.id];
        if (!target) {
          target = randomPoint(w, h);
          targetsRef.current[c.id] = target;
        }

        const current = p.cursor ?? randomPoint(w, h);
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 6) {
          // Reached target: pick a new one.
          targetsRef.current[c.id] = randomPoint(w, h);
        }

        const ease = 0.12;
        const nx = current.x + dx * ease;
        const ny = current.y + dy * ease;
        nextPresence[c.id] = { ...p, cursor: { x: nx, y: ny } };
        changed = true;
      }

      if (changed) collab.setState({ presence: nextPresence });
    };

    // --- Behavior loop: selection / editing / typing + activity ---
    const behave = () => {
      const state = collab.getState();
      if (!state.enabled) return;
      const online = state.onlineIds;
      if (online.length === 0) return;

      const appState = app.getState();
      const boardCards = appState.cards.filter(
        (card) => card.boardId === appState.selectedBoardId
      );
      if (boardCards.length === 0) return;

      const collabId = online[Math.floor(Math.random() * online.length)];
      const collaborator = MOCK_COLLABORATORS.find((c) => c.id === collabId);
      if (!collaborator) return;

      const card = boardCards[Math.floor(Math.random() * boardCards.length)];
      const roll = Math.random();

      if (roll < 0.4) {
        // Selecting a card
        collab.getState().setPresence(collabId, {
          selectedCardId: card.id,
          editingCardId: null,
          isTyping: false,
          lastActive: Date.now(),
        });
        pushActivity(collaborator.id, collaborator.name, 'card_selected', `selected "${card.title}"`);
      } else if (roll < 0.75) {
        // Editing a card (typing)
        collab.getState().setPresence(collabId, {
          selectedCardId: card.id,
          editingCardId: card.id,
          isTyping: true,
          lastActive: Date.now(),
        });
        pushActivity(collaborator.id, collaborator.name, 'card_edited', `is editing "${card.title}"`);
        // Stop typing shortly after.
        setTimeout(() => {
          collab.getState().setPresence(collabId, { isTyping: false });
        }, 1800);
      } else if (roll < 0.9) {
        // Moved a card
        collab.getState().setPresence(collabId, {
          selectedCardId: card.id,
          editingCardId: null,
          isTyping: false,
          lastActive: Date.now(),
        });
        pushActivity(collaborator.id, collaborator.name, 'card_moved', `moved "${card.title}"`);
      } else {
        // Clear focus
        collab.getState().setPresence(collabId, {
          selectedCardId: null,
          editingCardId: null,
          isTyping: false,
          lastActive: Date.now(),
        });
      }
    };

    const pushActivity = (
      userId: string,
      userName: string,
      action: Activity['action'],
      details: string
    ) => {
      const now = Date.now();
      // Throttle so the feed animates without flooding.
      if (now - lastActivityRef.current < 1500) return;
      lastActivityRef.current = now;
      const appState = app.getState();
      if (!appState.selectedProjectId) return;
      appState.addActivity({
        id: crypto.randomUUID(),
        projectId: appState.selectedProjectId,
        userId,
        userName,
        action,
        details,
        createdAt: new Date(),
      });
    };

    // --- Online/offline flips ---
    const flip = () => {
      const state = collab.getState();
      if (!state.enabled) return;
      const all = MOCK_COLLABORATORS.map((c) => c.id);
      const online = new Set(state.onlineIds);
      const candidate = all[Math.floor(Math.random() * all.length)];

      // Keep at least 2 online, at most all.
      if (online.has(candidate) && online.size > 2) {
        online.delete(candidate);
        // Clear presence when going offline.
        collab.getState().setPresence(candidate, {
          cursor: null,
          selectedCardId: null,
          editingCardId: null,
          isTyping: false,
        });
      } else if (!online.has(candidate)) {
        online.add(candidate);
        const collaborator = MOCK_COLLABORATORS.find((c) => c.id === candidate);
        if (collaborator) {
          pushActivity(collaborator.id, collaborator.name, 'member_joined', 'joined the board');
        }
      }
      collab.setState({ onlineIds: Array.from(online) });
    };

    const start = () => {
      if (moveTimer) return;
      moveTimer = setInterval(move, 1000 / MOVE_FPS);
      behaviorTimer = setInterval(behave, BEHAVIOR_MS);
      flipTimer = setInterval(flip, PRESENCE_FLIP_MS);
    };

    const stop = () => {
      if (moveTimer) clearInterval(moveTimer);
      if (behaviorTimer) clearInterval(behaviorTimer);
      if (flipTimer) clearInterval(flipTimer);
      moveTimer = behaviorTimer = flipTimer = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
}
