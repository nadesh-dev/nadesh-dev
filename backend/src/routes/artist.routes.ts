import { Router } from 'express';
import { pool } from '../database/connection';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT id, name, bio, image_url, created_at
       FROM artists
       ORDER BY name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const artists = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      bio: row.bio,
      imageUrl: row.image_url,
      createdAt: row.created_at
    }));

    res.json(artists);
  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const artistResult = await pool.query(
      'SELECT id, name, bio, image_url, created_at FROM artists WHERE id = $1',
      [id]
    );

    if (artistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const artist = artistResult.rows[0];

    const tracksResult = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url, t.play_count,
        al.id as album_id, al.title as album_title
       FROM tracks t
       LEFT JOIN albums al ON t.album_id = al.id
       WHERE t.artist_id = $1
       ORDER BY t.play_count DESC`,
      [id]
    );

    const tracks = tracksResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUrl: row.file_url,
      coverUrl: row.cover_url,
      playCount: row.play_count,
      album: row.album_id ? {
        id: row.album_id,
        title: row.album_title
      } : null
    }));

    const albumsResult = await pool.query(
      `SELECT id, title, cover_url, release_date
       FROM albums
       WHERE artist_id = $1
       ORDER BY release_date DESC`,
      [id]
    );

    const albums = albumsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      coverUrl: row.cover_url,
      releaseDate: row.release_date
    }));

    res.json({
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      imageUrl: artist.image_url,
      tracks,
      albums,
      createdAt: artist.created_at
    });
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});

export default router;
