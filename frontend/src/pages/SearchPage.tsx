import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchApi } from '../lib/api';
import { Track, usePlayerStore } from '../store/playerStore';
import TrackCard from '../components/TrackCard';

interface SearchResults {
  tracks: Track[];
  artists: Array<{
    id: number;
    name: string;
    imageUrl: string;
  }>;
  albums: Array<{
    id: number;
    title: string;
    coverUrl: string;
    artist: {
      id: number;
      name: string;
    };
  }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await searchApi.search(searchQuery);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    const timeoutId = setTimeout(() => handleSearch(value), 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Search</h1>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-black placeholder-gray-600 focus:outline-none"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-400">Searching...</div>
      )}

      {results && !loading && (
        <div className="space-y-8">
          {results.tracks.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Tracks</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results.tracks.slice(0, 12).map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </section>
          )}

          {results.artists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results.artists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => navigate(`/artist/${artist.id}`)}
                    className="card group"
                  >
                    <img
                      src={artist.imageUrl || 'https://via.placeholder.com/300'}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-full mb-4"
                    />
                    <h3 className="font-semibold text-white truncate text-center">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-400 text-center">Artist</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.albums.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results.albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => navigate(`/album/${album.id}`)}
                    className="card group"
                  >
                    <img
                      src={album.coverUrl || 'https://via.placeholder.com/300'}
                      alt={album.title}
                      className="w-full aspect-square object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-white truncate mb-1">
                      {album.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {album.artist.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.tracks.length === 0 &&
            results.artists.length === 0 &&
            results.albums.length === 0 && (
              <div className="text-center text-gray-400">
                No results found for "{query}"
              </div>
            )}
        </div>
      )}
    </div>
  );
}
