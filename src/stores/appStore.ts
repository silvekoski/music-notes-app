import { create } from 'zustand';
import { Project, Board, Card, Tag, BoardSettings, User, Comment, Activity } from '@/types';
import { mockUser, mockProjects, mockBoards, mockCards, mockTags, mockComments } from '@/lib/mockData';

interface AppState {
  user: User | null;
  projects: Project[];
  boards: Board[];
  cards: Card[];
  tags: Tag[];
  comments: Comment[];
  activities: Activity[];
  selectedProjectId: string | null;
  selectedBoardId: string | null;
  searchQuery: string;
  selectedTags: string[];
  activeView: 'board' | 'userSettings';
  setActiveView: (view: 'board' | 'userSettings') => void;
  boardSettings: BoardSettings;

  // Actions
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  selectProject: (projectId: string | null) => void;
  selectBoard: (boardId: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tagId: string) => void;
  setBoardSettings: (settings: Partial<BoardSettings>) => void;
  addComment: (comment: Comment) => void;
  getCardComments: (cardId: string) => Comment[];
  addActivity: (activity: Activity) => void;
  getProjectActivities: (projectId: string) => Activity[];
}

const defaultBoardSettings: BoardSettings = {
  removeCornerRadius: false,
  removeCardSpacing: false,
  hideCardTitles: false,
  aspectRatio: '4:5',
  gridWidth: 6,
  extraEmptyRows: 9,
  disableAutoSort: false,
  freeGridMovement: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  user: mockUser,
  projects: mockProjects,
  boards: mockBoards,
  cards: mockCards,
  tags: mockTags,
  comments: mockComments,
  activities: [],
  selectedProjectId: mockProjects[0]?.id ?? null,
  selectedBoardId: mockBoards[0]?.id ?? null,
  searchQuery: '',
  selectedTags: [],
  activeView: 'board',
  boardSettings: defaultBoardSettings,

  setActiveView: (view) => set({ activeView: view }),
  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => {
    if (state.projects.find((p) => p.id === project.id)) return state;
    return { projects: [...state.projects, project] };
  }),
  deleteProject: (projectId) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== projectId),
    boards: state.boards.filter((b) => b.projectId !== projectId),
  })),
  setBoards: (boards) => set({ boards }),
  addBoard: (board) => set((state) => {
    if (state.boards.find((b) => b.id === board.id)) return state;
    return { boards: [...state.boards, board] };
  }),
  deleteBoard: (boardId) => set((state) => ({
    boards: state.boards.filter((b) => b.id !== boardId),
    cards: state.cards.filter((c) => c.boardId !== boardId),
  })),
  setCards: (cards) => set({ cards }),
  addCard: (card) => set((state) => {
    if (state.cards.find((c) => c.id === card.id)) return state;
    return { cards: [...state.cards, card] };
  }),
  updateCard: (cardId, updates) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
      ),
    })),
  deleteCard: (cardId) =>
    set((state) => ({ cards: state.cards.filter((card) => card.id !== cardId) })),
  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  selectProject: (projectId) => set({ selectedProjectId: projectId }),
  selectBoard: (boardId) => set({ selectedBoardId: boardId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTag: (tagId) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tagId)
        ? state.selectedTags.filter((id) => id !== tagId)
        : [...state.selectedTags, tagId],
    })),
  setBoardSettings: (settings) =>
    set((state) => ({ boardSettings: { ...state.boardSettings, ...settings } })),
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  getCardComments: (cardId) => get().comments.filter((c) => c.cardId === cardId),
  addActivity: (activity) =>
    set((state) => ({ activities: [activity, ...state.activities] })),
  getProjectActivities: (projectId) =>
    get().activities.filter((a) => a.projectId === projectId),
}));
