import { Router } from 'express';
import { pool } from '../database/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url, t.play_count,
        t.created_at, t.updated_at,
        a.id as artist_id, a.name as artist_name, a.image_url as artist_image,
        al.id as album_id, al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const tracks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUrl: row.file_url,
      coverUrl: row.cover_url,
      playCount: row.play_count,
      artist: {
        id: row.artist_id,
        name: row.artist_name,
        imageUrl: row.artist_image
      },
      album: row.album_id ? {
        id: row.album_id,
        title: row.album_title,
        coverUrl: row.album_cover
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Get tracks error:', error);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const result = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url, t.play_count,
        a.id as artist_id, a.name as artist_name, a.image_url as artist_image,
        al.id as album_id, al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      ORDER BY t.play_count DESC
      LIMIT $1`,
      [limit]
    );

    const tracks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUrl: row.file_url,
      coverUrl: row.cover_url,
      playCount: row.play_count,
      artist: {
        id: row.artist_id,
        name: row.artist_name,
        imageUrl: row.artist_image
      },
      album: row.album_id ? {
        id: row.album_id,
        title: row.album_title,
        coverUrl: row.album_cover
      } : null
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Get popular tracks error:', error);
    res.status(500).json({ error: 'Failed to fetch popular tracks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url, t.play_count,
        t.created_at, t.updated_at,
        a.id as artist_id, a.name as artist_name, a.image_url as artist_image,
        al.id as album_id, al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const row = result.rows[0];
    const track = {
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUrl: row.file_url,
      coverUrl: row.cover_url,
      playCount: row.play_count,
      artist: {
        id: row.artist_id,
        name: row.artist_name,
        imageUrl: row.artist_image
      },
      album: row.album_id ? {
        id: row.album_id,
        title: row.album_title,
        coverUrl: row.album_cover
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.json(track);
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

router.post('/:id/play', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await pool.query('BEGIN');

    await pool.query(
      'UPDATE tracks SET play_count = play_count + 1 WHERE id = $1',
      [id]
    );

    await pool.query(
      'INSERT INTO listening_history (user_id, track_id) VALUES ($1, $2)',
      [userId, id]
    );

    await pool.query('COMMIT');

    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Track play error:', error);
    res.status(500).json({ error: 'Failed to record play' });
  }
});

export default router;
