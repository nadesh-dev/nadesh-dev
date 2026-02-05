import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artistsApi } from '../lib/api';
import { Track } from '../store/playerStore';
import TrackList from '../components/TrackList';

interface Artist {
  id: number;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  tracks: Track[];
  albums: Array<{
    id: number;
    title: string;
    coverUrl: string;
    releaseDate: string;
  }>;
}

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadArtist();
  }, [id]);

  const loadArtist = async () => {
    try {
      const response = await artistsApi.getById(parseInt(id!));
      setArtist(response.data);
    } catch (error) {
      console.error('Failed to load artist:', error);
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

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Artist not found</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="h-80 bg-gradient-to-b from-purple-900 to-transparent px-8 flex items-end pb-8"
        style={{
          backgroundImage: artist.imageUrl
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${artist.imageUrl})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-end gap-6">
          {artist.imageUrl && (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-48 h-48 rounded-full shadow-2xl"
            />
          )}
          <div>
            <p className="text-sm font-semibold uppercase">Artist</p>
            <h1 className="text-6xl font-bold text-white mb-4">{artist.name}</h1>
            {artist.bio && <p className="text-gray-300 max-w-2xl">{artist.bio}</p>}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-4">Popular Tracks</h2>
        <TrackList tracks={artist.tracks.slice(0, 10)} />

        {artist.albums.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {artist.albums.map((album) => (
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
                  <p className="text-sm text-gray-400">
                    {new Date(album.releaseDate).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
