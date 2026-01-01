import { Router } from 'express';
import { pool } from '../database/connection';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT 
        al.id, al.title, al.cover_url, al.release_date, al.created_at,
        a.id as artist_id, a.name as artist_name
       FROM albums al
       JOIN artists a ON al.artist_id = a.id
       ORDER BY al.release_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const albums = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      coverUrl: row.cover_url,
      releaseDate: row.release_date,
      artist: {
        id: row.artist_id,
        name: row.artist_name
      },
      createdAt: row.created_at
    }));

    res.json(albums);
  } catch (error) {
    console.error('Get albums error:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const albumResult = await pool.query(
      `SELECT 
        al.id, al.title, al.cover_url, al.release_date, al.created_at,
        a.id as artist_id, a.name as artist_name, a.image_url as artist_image
       FROM albums al
       JOIN artists a ON al.artist_id = a.id
       WHERE al.id = $1`,
      [id]
    );

    if (albumResult.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const album = albumResult.rows[0];

    const tracksResult = await pool.query(
      `SELECT id, title, duration, file_url, cover_url, play_count
       FROM tracks
       WHERE album_id = $1
       ORDER BY id`,
      [id]
    );

    const tracks = tracksResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUrl: row.file_url,
      coverUrl: row.cover_url,
      playCount: row.play_count
    }));

    res.json({
      id: album.id,
      title: album.title,
      coverUrl: album.cover_url,
      releaseDate: album.release_date,
      artist: {
        id: album.artist_id,
        name: album.artist_name,
        imageUrl: album.artist_image
      },
      tracks,
      createdAt: album.created_at
    });
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

export default router;
