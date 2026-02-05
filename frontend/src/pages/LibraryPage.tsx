import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistsApi, userApi } from '../lib/api';
import { Track } from '../store/playerStore';
import TrackList from '../components/TrackList';

interface Playlist {
  id: number;
  name: string;
  description: string | null;
  coverUrl: string | null;
  trackCount: number;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites'>('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'playlists') {
        const response = await playlistsApi.getMyPlaylists();
        setPlaylists(response.data);
      } else {
        const response = await userApi.getFavorites();
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Your Library</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('playlists')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'playlists'
              ? 'bg-white text-black'
              : 'bg-dark-50 text-white hover:bg-dark-100'
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'favorites'
              ? 'bg-white text-black'
              : 'bg-dark-50 text-white hover:bg-dark-100'
          }`}
        >
          Liked Songs
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : activeTab === 'playlists' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="card group"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-md mb-4 flex items-center justify-center">
                {playlist.coverUrl ? (
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-6xl">🎵</span>
                )}
              </div>
              <h3 className="font-semibold text-white truncate mb-1">
                {playlist.name}
              </h3>
              <p className="text-sm text-gray-400">
                {playlist.trackCount} {playlist.trackCount === 1 ? 'song' : 'songs'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {favorites.length > 0 ? (
            <TrackList tracks={favorites} />
          ) : (
            <div className="text-center text-gray-400 mt-12">
              <p>No liked songs yet</p>
              <p className="text-sm mt-2">Start liking songs to see them here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
