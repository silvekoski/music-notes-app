export interface Project {
  id: string;
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  projectId: string;
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  boardId: string;
  title: string;
  shortNote?: string;
  content?: string;
  tags: string[];
  attachmentType?: 'file' | 'markdown';
  attachmentUrl?: string;
  attachmentMeta?: {
    type: 'image' | 'audio' | 'video';
    format: string;
    size: string;
    duration?: string;
    width?: number;
    height?: number;
  };
  position: { x: number; y: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type CardAspectRatio = '4:5' | '1:1' | '5:4';

export interface BoardSettings {
  removeCornerRadius: boolean;
  hideCardBorders: boolean;
  removeCardSpacing: boolean;
  hideCardTitles: boolean;
  aspectRatio: CardAspectRatio;
  gridWidth: number;
  extraEmptyRows: number;
  disableAutoSort: boolean;
  freeGridMovement: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  username?: string;
  bio?: string;
  role?: string;
  location?: string;
  timezone?: string;
  language?: string;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  action:
    | 'card_created'
    | 'card_edited'
    | 'card_deleted'
    | 'member_joined'
    | 'settings_changed'
    | 'card_selected'
    | 'card_moved'
    | 'comment_added';
  details: string;
  createdAt: Date;
}

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  initials: string;
  avatarUrl?: string;
}

export interface PresenceState {
  collaboratorId: string;
  cursor: { x: number; y: number } | null;
  selectedCardId: string | null;
  editingCardId: string | null;
  isTyping: boolean;
  lastActive: number;
}
