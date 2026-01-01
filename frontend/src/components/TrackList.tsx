import { Play, MoreHorizontal } from 'lucide-react';
import { Track, usePlayerStore } from '../store/playerStore';
import { formatDuration } from '../lib/utils';

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
}

export default function TrackList({ tracks, showAlbum = true }: TrackListProps) {
  const { setCurrentTrack, setQueue, currentTrack } = usePlayerStore();

  const handlePlayTrack = (track: Track, index: number) => {
    setCurrentTrack(track);
    setQueue(tracks);
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[50px_1fr_1fr_100px] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
        <div>#</div>
        <div>TITLE</div>
        {showAlbum && <div>ALBUM</div>}
        <div className="text-right">DURATION</div>
      </div>

      <div className="mt-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`grid ${
              showAlbum ? 'grid-cols-[50px_1fr_1fr_100px]' : 'grid-cols-[50px_1fr_100px]'
            } gap-4 px-4 py-2 hover:bg-dark-50 rounded group cursor-pointer items-center`}
            onClick={() => handlePlayTrack(track, index)}
          >
            <div className="flex items-center justify-center">
              {currentTrack?.id === track.id ? (
                <Play size={16} className="text-primary fill-primary" />
              ) : (
                <>
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play size={16} className="hidden group-hover:block" />
                </>
              )}
            </div>

            <div className="flex items-center gap-3 min-w-0">
              {track.coverUrl && (
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded"
                />
              )}
              <div className="min-w-0">
                <div
                  className={`font-medium truncate ${
                    currentTrack?.id === track.id ? 'text-primary' : 'text-white'
                  }`}
                >
                  {track.title}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {track.artist.name}
                </div>
              </div>
            </div>

            {showAlbum && (
              <div className="text-sm text-gray-400 truncate">
                {track.album?.title || '-'}
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              <span className="text-sm text-gray-400">
                {formatDuration(track.duration)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="opacity-0 group-hover:opacity-100 transition"
              >
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
