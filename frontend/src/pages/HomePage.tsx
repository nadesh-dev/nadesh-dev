import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tracksApi, albumsApi } from '../lib/api';
import { Track } from '../store/playerStore';
import TrackCard from '../components/TrackCard';

interface Album {
  id: number;
  title: string;
  coverUrl: string;
  artist: {
    id: number;
    name: string;
  };
}

export default function HomePage() {
  const [popularTracks, setPopularTracks] = useState<Track[]>([]);
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tracksRes, albumsRes] = await Promise.all([
        tracksApi.getPopular(12),
        albumsApi.getAll(12, 0),
      ]);
      
      setPopularTracks(tracksRes.data);
      setRecentAlbums(albumsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Good evening</h1>
        <p className="text-gray-400">Discover your favorite music</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {recentAlbums.map((album) => (
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
              <p className="text-sm text-gray-400 truncate">{album.artist.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
