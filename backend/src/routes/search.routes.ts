import { Router } from 'express';
import { pool } from '../database/connection';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${q.toLowerCase()}%`;
    const results: any = {
      tracks: [],
      artists: [],
      albums: []
    };

    if (type === 'all' || type === 'tracks') {
      const tracksResult = await pool.query(
        `SELECT 
          t.id, t.title, t.duration, t.file_url, t.cover_url, t.play_count,
          a.id as artist_id, a.name as artist_name,
          al.id as album_id, al.title as album_title
         FROM tracks t
         LEFT JOIN artists a ON t.artist_id = a.id
         LEFT JOIN albums al ON t.album_id = al.id
         WHERE LOWER(t.title) LIKE $1
         ORDER BY t.play_count DESC
         LIMIT 20`,
        [searchTerm]
      );

      results.tracks = tracksResult.rows.map(row => ({
        id: row.id,
        title: row.title,
        duration: row.duration,
        fileUrl: row.file_url,
        coverUrl: row.cover_url,
        playCount: row.play_count,
        artist: {
          id: row.artist_id,
          name: row.artist_name
        },
        album: row.album_id ? {
          id: row.album_id,
          title: row.album_title
        } : null
      }));
    }

    if (type === 'all' || type === 'artists') {
      const artistsResult = await pool.query(
        `SELECT id, name, bio, image_url
         FROM artists
         WHERE LOWER(name) LIKE $1
         LIMIT 20`,
        [searchTerm]
      );

      results.artists = artistsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        bio: row.bio,
        imageUrl: row.image_url
      }));
    }

    if (type === 'all' || type === 'albums') {
      const albumsResult = await pool.query(
        `SELECT 
          al.id, al.title, al.cover_url, al.release_date,
          a.id as artist_id, a.name as artist_name
         FROM albums al
         JOIN artists a ON al.artist_id = a.id
         WHERE LOWER(al.title) LIKE $1
         LIMIT 20`,
        [searchTerm]
      );

      results.albums = albumsResult.rows.map(row => ({
        id: row.id,
        title: row.title,
        coverUrl: row.cover_url,
        releaseDate: row.release_date,
        artist: {
          id: row.artist_id,
          name: row.artist_name
        }
      }));
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

export default router;
