import { Collaborator } from '@/types';

// Collaboration accent colors are intentionally kept separate from the app's
// grayscale wireframe theme. They are used ONLY for cursors, avatar rings, and
// selection outlines so each collaborator stays visually distinguishable.
export const MOCK_COLLABORATORS: Collaborator[] = [
  { id: 'collab-alex', name: 'Alex Rivera', initials: 'AR', color: '#6366f1' }, // indigo
  { id: 'collab-sam', name: 'Sam Chen', initials: 'SC', color: '#14b8a6' }, // teal
  { id: 'collab-mia', name: 'Mia Torres', initials: 'MT', color: '#f59e0b' }, // amber
  { id: 'collab-jordan', name: 'Jordan Lee', initials: 'JL', color: '#f43f5e' }, // rose
  { id: 'collab-noor', name: 'Noor Hassan', initials: 'NH', color: '#8b5cf6' }, // violet
];

export function getCollaborator(id: string | null | undefined): Collaborator | undefined {
  if (!id) return undefined;
  return MOCK_COLLABORATORS.find((c) => c.id === id);
}
