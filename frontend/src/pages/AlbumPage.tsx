import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { albumsApi } from '../lib/api';
import { Track, usePlayerStore } from '../store/playerStore';
import TrackList from '../components/TrackList';
import { formatDate } from '../lib/utils';

interface Album {
  id: number;
  title: string;
  coverUrl: string | null;
  releaseDate: string;
  artist: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
  tracks: Track[];
}

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setCurrentTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    if (id) loadAlbum();
  }, [id]);

  const loadAlbum = async () => {
    try {
      const response = await albumsApi.getById(parseInt(id!));
      setAlbum(response.data);
    } catch (error) {
      console.error('Failed to load album:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAlbum = () => {
    if (album && album.tracks.length > 0) {
      setCurrentTrack(album.tracks[0]);
      setQueue(album.tracks);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Album not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="h-80 bg-gradient-to-b from-blue-900 to-transparent px-8 flex items-end pb-8">
        <div className="flex items-end gap-6">
          <img
            src={album.coverUrl || 'https://via.placeholder.com/300'}
            alt={album.title}
            className="w-48 h-48 rounded shadow-2xl"
          />
          <div>
            <p className="text-sm font-semibold uppercase">Album</p>
            <h1 className="text-6xl font-bold text-white mb-4">{album.title}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span
                className="font-semibold text-white cursor-pointer hover:underline"
                onClick={() => navigate(`/artist/${album.artist.id}`)}
              >
                {album.artist.name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{formatDate(album.releaseDate)}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <button
          onClick={handlePlayAlbum}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg mb-6"
        >
          <Play size={24} className="text-black fill-black ml-1" />
        </button>

        <TrackList tracks={album.tracks} showAlbum={false} />
      </div>
    </div>
  );
}
