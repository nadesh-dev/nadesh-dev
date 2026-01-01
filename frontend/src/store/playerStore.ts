import { create } from 'zustand';

export interface Track {
  id: number;
  title: string;
  duration: number;
  fileUrl: string;
  coverUrl: string | null;
  artist: {
    id: number;
    name: string;
  };
  album?: {
    id: number;
    title: string;
  } | null;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  
  setCurrentTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: 'off' | 'all' | 'one') => void;
  toggleShuffle: () => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  volume: 0.7,
  repeat: 'off',
  shuffle: false,

  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  
  setQueue: (tracks) => set({ queue: tracks }),
  
  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track]
  })),
  
  playNext: () => {
    const { queue, currentTrack, repeat } = get();
    if (!currentTrack) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1], currentTime: 0 });
    } else if (repeat === 'all' && queue.length > 0) {
      set({ currentTrack: queue[0], currentTime: 0 });
    }
  },
  
  playPrevious: () => {
    const { queue, currentTrack, currentTime } = get();
    if (!currentTrack) return;
    
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1], currentTime: 0 });
    }
  },
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  setVolume: (volume) => set({ volume }),
  
  setRepeat: (repeat) => set({ repeat }),
  
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  
  clearQueue: () => set({ queue: [], currentTrack: null, isPlaying: false }),
}));
