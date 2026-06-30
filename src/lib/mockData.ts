import { Project, Board, Card, Tag, User, Comment } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'designer@musicnotes.app',
  name: 'Alex Rivera',
};

export const mockTags: Tag[] = [
  { id: 't1', name: 'lyrics', color: '#8B7355' },
  { id: 't2', name: 'demo', color: '#D97757' },
  { id: 't3', name: 'inspiration', color: '#5B8C5A' },
  { id: 't4', name: 'reference', color: '#5B7DB1' },
  { id: 't5', name: 'final', color: '#A85751' },
  { id: 't6', name: 'wip', color: '#C7A04F' },
  { id: 't7', name: 'mix', color: '#6B5B95' },
  { id: 't8', name: 'master', color: '#2E3A59' },
  { id: 't9', name: 'idea', color: '#E8A87C' },
  { id: 't10', name: 'voice-memo', color: '#C38D9E' },
  { id: 't11', name: 'chord-chart', color: '#41B3A3' },
  { id: 't12', name: 'archive', color: '#85929E' },
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Midnight Album', icon: 'music', createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-05-12') },
  { id: 'p2', name: 'Acoustic EP', icon: 'headphones', createdAt: new Date('2025-02-20'), updatedAt: new Date('2025-04-30') },
  { id: 'p3', name: 'Songwriting Vault', icon: 'pen', createdAt: new Date('2025-03-01'), updatedAt: new Date('2025-05-22') },
  { id: 'p4', name: 'Live Sessions', icon: 'mic', createdAt: new Date('2025-03-15'), updatedAt: new Date('2025-05-20') },
  { id: 'p5', name: 'Film Scoring', icon: 'film', createdAt: new Date('2025-01-25'), updatedAt: new Date('2025-05-18') },
  { id: 'p6', name: 'Beats & Loops', icon: 'grid', createdAt: new Date('2025-04-05'), updatedAt: new Date('2025-05-21') },
  { id: 'p7', name: 'Collab w/ Mira', icon: 'users', createdAt: new Date('2025-02-02'), updatedAt: new Date('2025-05-10') },
  { id: 'p8', name: 'Archive 2024', icon: 'archive', createdAt: new Date('2024-11-10'), updatedAt: new Date('2024-12-30') },
];

export const mockBoards: Board[] = [
  // Midnight Album
  { id: 'b1', projectId: 'p1', name: 'Track Ideas', icon: 'lightbulb', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b2', projectId: 'p1', name: 'Lyrics', icon: 'pen', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b3', projectId: 'p1', name: 'Demos', icon: 'mic', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b3b', projectId: 'p1', name: 'Mixes', icon: 'sliders', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b3c', projectId: 'p1', name: 'Artwork', icon: 'image', createdAt: new Date(), updatedAt: new Date() },
  // Acoustic EP
  { id: 'b4', projectId: 'p2', name: 'Sketches', icon: 'grid', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b5', projectId: 'p2', name: 'References', icon: 'headphones', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b5b', projectId: 'p2', name: 'Studio Sessions', icon: 'mic', createdAt: new Date(), updatedAt: new Date() },
  // Songwriting Vault
  { id: 'b6', projectId: 'p3', name: 'Hooks & Phrases', icon: 'lightbulb', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b6b', projectId: 'p3', name: 'Verses', icon: 'pen', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b6c', projectId: 'p3', name: 'Chord Progressions', icon: 'grid', createdAt: new Date(), updatedAt: new Date() },
  // Live Sessions
  { id: 'b7', projectId: 'p4', name: 'Setlists', icon: 'list', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b8', projectId: 'p4', name: 'Recordings', icon: 'mic', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b9', projectId: 'p4', name: 'Venue Photos', icon: 'image', createdAt: new Date(), updatedAt: new Date() },
  // Film Scoring
  { id: 'b10', projectId: 'p5', name: 'Themes', icon: 'music', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b11', projectId: 'p5', name: 'Scene Cues', icon: 'film', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b12', projectId: 'p5', name: 'Mood Board', icon: 'image', createdAt: new Date(), updatedAt: new Date() },
  // Beats & Loops
  { id: 'b13', projectId: 'p6', name: 'Drum Loops', icon: 'grid', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b14', projectId: 'p6', name: 'Synth Patches', icon: 'sliders', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b15', projectId: 'p6', name: 'Samples', icon: 'archive', createdAt: new Date(), updatedAt: new Date() },
  // Collab w/ Mira
  { id: 'b16', projectId: 'p7', name: 'Shared Ideas', icon: 'users', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b17', projectId: 'p7', name: 'Voice Notes', icon: 'mic', createdAt: new Date(), updatedAt: new Date() },
  // Archive
  { id: 'b18', projectId: 'p8', name: 'Old Demos', icon: 'archive', createdAt: new Date(), updatedAt: new Date() },
  { id: 'b19', projectId: 'p8', name: 'Released Tracks', icon: 'music', createdAt: new Date(), updatedAt: new Date() },
];

const sampleImages = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800',
  'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=800',
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
  'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800',
  'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=800',
  'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800',
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
  'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800',
  'https://images.unsplash.com/photo-1486092642310-0c4c0a6fb0e8?w=800',
  'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=800',
  'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=800',
  'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
  'https://images.unsplash.com/photo-1473396413399-6717ef7c4093?w=800',
  'https://images.unsplash.com/photo-1481886756534-97af88ccb438?w=800',
  'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800',
];

const titles = [
  'Sunset Drive', 'Velvet Hours', 'Echoes', 'Paper Moon', 'City Lights',
  'Glass Heart', 'Northern Wind', 'Slow Burn', 'Floating', 'After Hours',
  'Golden Hour', 'Silhouette', 'Wildflower', 'Polaroid', 'Neon Rain',
  'Quiet Storm', 'Marigold', 'Coastline', 'Soft Static', 'Daydream',
  'Lantern', 'Hollow', 'Underwater', 'Saltwater', 'Cathedral',
  'Driftwood', 'Lost Highway', 'Cassette', 'Snowfall', 'Lighthouse',
  'Ferris Wheel', 'Pale Blue', 'Backroads', 'Honeycomb', 'Embers',
  'Riverbed', 'Stillwater', 'Moth & Flame', 'Aurora', 'Magnolia',
  'Indigo', 'Cinder', 'Petrichor', 'Tidepool', 'Constellations',
  'Half Moon', 'Linen', 'Porcelain', 'Long Way Home', 'Smoke Signals',
];

const notes = [
  'BPM around 92, dreamy synth pads',
  'Capo 3, fingerpicked verses',
  'Drop D tuning, heavy reverb',
  'Try a half-time chorus here',
  'Reference: Phoebe Bridgers vibe',
  'Vocal harmonies on the bridge',
  'Add field-recorded ambience',
  'Layered acoustic + Rhodes',
  'Pulse-y 80s drum machine feel',
  'Rework the second verse melody',
  'Tape saturation on the master bus',
  'Add string section for the outro',
  'Mellotron flutes under the chorus',
  'Try doubling vocals an octave up',
  'Sidechain pad to kick',
  'Looser swing on the hi-hats',
  'Cut the intro by 4 bars',
  'Modulate up a semitone for last chorus',
];

const lyricSnippets = [
  '"and the streets all hum like a quiet song / when the lights go down low"',
  '"I keep your jacket folded in the drawer / smells like november and the shore"',
  '"we were paper boats in a summer flood / never meant to last"',
  '"if the morning forgets us, that\'s alright / I memorized the way you said goodnight"',
  '"hollow rooms and a kettle\'s hiss / the kind of love you almost miss"',
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function makeCards(): Card[] {
  const cards: Card[] = [];
  const tagPool = ['lyrics', 'demo', 'inspiration', 'reference', 'wip', 'final', 'mix', 'master', 'idea', 'voice-memo', 'chord-chart', 'archive'];
  let idx = 0;
  mockBoards.forEach((board, boardIdx) => {
    const count = 14 + Math.floor(pseudoRandom(boardIdx + 1) * 10);
    for (let i = 0; i < count; i++) {
      const r = pseudoRandom(idx + 17);
      const hasImage = r > 0.35;
      const tagCount = Math.floor(pseudoRandom(idx + 3) * 4);
      const tags = Array.from({ length: tagCount }, (_, k) => tagPool[Math.floor(pseudoRandom(idx * 7 + k) * tagPool.length)]);
      const isLyric = !hasImage && pseudoRandom(idx + 9) > 0.5;
      cards.push({
        id: `c-${board.id}-${i}`,
        boardId: board.id,
        title: titles[idx % titles.length],
        shortNote: isLyric ? lyricSnippets[idx % lyricSnippets.length] : notes[idx % notes.length],
        content: '',
        tags: [...new Set(tags)],
        attachmentType: hasImage ? 'file' : 'markdown',
        attachmentUrl: hasImage ? sampleImages[idx % sampleImages.length] : undefined,
        attachmentMeta: hasImage
          ? { type: 'image', format: 'jpg', size: `${280 + (idx % 9) * 60} KB`, width: 800, height: 600 }
          : undefined,
        position: { x: i % 6, y: Math.floor(i / 6) },
        createdAt: new Date(Date.now() - idx * 3600000 * 12),
        updatedAt: new Date(Date.now() - idx * 3600000),
      });
      idx++;
    }
  });
  return cards;
}

export const mockCards: Card[] = makeCards();

export const mockComments: Comment[] = [
  {
    id: 'cm1',
    cardId: mockCards[0]?.id ?? '',
    userId: 'user-2',
    userName: 'Sarah Chen',
    content: 'Love the mood here — feels very late-night.',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'cm2',
    cardId: mockCards[1]?.id ?? '',
    userId: 'user-3',
    userName: 'Mira Patel',
    content: 'Try swapping the second chord for a minor 7th?',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'cm3',
    cardId: mockCards[2]?.id ?? '',
    userId: 'user-2',
    userName: 'Sarah Chen',
    content: 'This hook is stuck in my head. Keep it.',
    createdAt: new Date(Date.now() - 86400000),
  },
];
