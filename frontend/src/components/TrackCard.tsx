import { Play } from 'lucide-react';
import { Track, usePlayerStore } from '../store/playerStore';

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
}

export default function TrackCard({ track, onClick }: TrackCardProps) {
  const { setCurrentTrack, setQueue } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrack(track);
    setQueue([track]);
  };

  return (
    <div
      onClick={onClick}
      className="card group relative"
    >
      <div className="relative">
        <img
          src={track.coverUrl || 'https://via.placeholder.com/300'}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"
        >
          <Play size={24} className="text-black fill-black ml-1" />
        </button>
      </div>
      
      <h3 className="font-semibold text-white truncate mb-1">{track.title}</h3>
      <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
    </div>
  );
}
