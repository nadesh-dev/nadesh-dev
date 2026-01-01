import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Trash2 } from 'lucide-react';
import { playlistsApi } from '../lib/api';
import { Track, usePlayerStore } from '../store/playerStore';
import TrackList from '../components/TrackList';
import { formatDate } from '../lib/utils';

interface Playlist {
  id: number;
  name: string;
  description: string | null;
  coverUrl: string | null;
  isPublic: boolean;
  owner: {
    username: string;
    displayName: string;
  };
  tracks: Track[];
  createdAt: string;
}

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    if (id) loadPlaylist();
  }, [id]);

  const loadPlaylist = async () => {
    try {
      const response = await playlistsApi.getById(parseInt(id!));
      setPlaylist(response.data);
    } catch (error) {
      console.error('Failed to load playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPlaylist = () => {
    if (playlist && playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0]);
      setQueue(playlist.tracks);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist || !window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      await playlistsApi.delete(playlist.id);
      window.history.back();
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="h-80 bg-gradient-to-b from-indigo-900 to-transparent px-8 flex items-end pb-8">
        <div className="flex items-end gap-6">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded shadow-2xl flex items-center justify-center">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-8xl">🎵</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase">Playlist</p>
            <h1 className="text-6xl font-bold text-white mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-gray-300 mb-2">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-white">
                {playlist.owner.displayName}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handlePlayPlaylist}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg"
            disabled={playlist.tracks.length === 0}
          >
            <Play size={24} className="text-black fill-black ml-1" />
          </button>

          <button
            onClick={handleDeletePlaylist}
            className="text-gray-400 hover:text-white transition"
            title="Delete playlist"
          >
            <Trash2 size={24} />
          </button>
        </div>

        {playlist.tracks.length > 0 ? (
          <TrackList tracks={playlist.tracks} />
        ) : (
          <div className="text-center text-gray-400 mt-12">
            <p>This playlist is empty</p>
            <p className="text-sm mt-2">Start adding songs to this playlist</p>
          </div>
        )}
      </div>
    </div>
  );
}
