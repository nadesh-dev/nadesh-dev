import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playlistsApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface Playlist {
  id: number;
  name: string;
  trackCount: number;
}

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const response = await playlistsApi.getMyPlaylists();
      setPlaylists(response.data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  };

  const createPlaylist = async () => {
    const name = prompt('Enter playlist name:');
    if (!name) return;

    try {
      await playlistsApi.create(name);
      loadPlaylists();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-black flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Music Stream</h1>
      </div>

      <nav className="flex-1 px-2">
        <Link
          to="/"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
            isActive('/') ? 'bg-dark-50 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home size={24} />
          <span className="font-semibold">Home</span>
        </Link>

        <Link
          to="/search"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
            isActive('/search') ? 'bg-dark-50 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search size={24} />
          <span className="font-semibold">Search</span>
        </Link>

        <Link
          to="/library"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
            isActive('/library') ? 'bg-dark-50 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Library size={24} />
          <span className="font-semibold">Your Library</span>
        </Link>

        <div className="mt-6">
          <button
            onClick={createPlaylist}
            className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition w-full"
          >
            <Plus size={24} />
            <span className="font-semibold">Create Playlist</span>
          </button>

          <Link
            to="/library?tab=favorites"
            className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition"
          >
            <Heart size={24} />
            <span className="font-semibold">Liked Songs</span>
          </Link>
        </div>

        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="px-4 text-xs text-gray-400 mb-2">PLAYLISTS</div>
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition truncate"
              >
                {playlist.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="text-white font-semibold">{user?.displayName}</div>
            <div className="text-gray-400 text-xs">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="text-xs text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
