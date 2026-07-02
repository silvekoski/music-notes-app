import { useCollaborationStore } from '@/stores/collaborationStore';
import { getCollaborator } from '@/lib/collaborators';

/**
 * Absolutely-positioned overlay of collaborator cursors. Must be rendered inside
 * a `relative` wrapper whose top-left corner matches the board-content origin so
 * presence coordinates line up with what people are pointing at.
 */
export function LiveCursors() {
  const enabled = useCollaborationStore((s) => s.enabled);
  const presence = useCollaborationStore((s) => s.presence);
  const onlineIds = useCollaborationStore((s) => s.onlineIds);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {onlineIds.map((id) => {
        const p = presence[id];
        const collaborator = getCollaborator(id);
        if (!p || !p.cursor || !collaborator) return null;

        return (
          <div
            key={id}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              transform: `translate(${p.cursor.x}px, ${p.cursor.y}px)`,
              transition: 'transform 90ms linear',
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="drop-shadow-sm"
              aria-hidden="true"
            >
              <path
                d="M2 2L8.5 17L11 10.5L17.5 8L2 2Z"
                fill={collaborator.color}
                stroke="white"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>

            {/* Name label */}
            <span
              className="absolute left-4 top-4 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium text-white shadow-sm"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.name}
              {p.isTyping && <span className="ml-1 opacity-80">is typing…</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
