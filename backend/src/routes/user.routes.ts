import { Router } from 'express';
import { pool } from '../database/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/favorites', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url, t.play_count,
        a.id as artist_id, a.name as artist_name,
        al.id as album_id, al.title as album_title,
        uf.created_at as favorited_at
       FROM user_favorites uf
       JOIN tracks t ON uf.track_id = t.id
       LEFT JOIN artists a ON t.artist_id = a.id
       LEFT JOIN albums al ON t.album_id = al.id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );

    const favorites = result.rows.map(row => ({
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
      } : null,
      favoritedAt: row.favorited_at
    }));

    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/favorites/:trackId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { trackId } = req.params;

    await pool.query(
      'INSERT INTO user_favorites (user_id, track_id) VALUES ($1, $2) ON CONFLICT (user_id, track_id) DO NOTHING',
      [userId, trackId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

router.delete('/favorites/:trackId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { trackId } = req.params;

    await pool.query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND track_id = $2',
      [userId, trackId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 50 } = req.query;

    const result = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url,
        a.id as artist_id, a.name as artist_name,
        al.id as album_id, al.title as album_title,
        lh.played_at
       FROM listening_history lh
       JOIN tracks t ON lh.track_id = t.id
       LEFT JOIN artists a ON t.artist_id = a.id
       LEFT JOIN albums al ON t.album_id = al.id
       WHERE lh.user_id = $1
       ORDER BY lh.played_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    const history = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUrl: row.file_url,
      coverUrl: row.cover_url,
      artist: {
        id: row.artist_id,
        name: row.artist_name
      },
      album: row.album_id ? {
        id: row.album_id,
        title: row.album_title
      } : null,
      playedAt: row.played_at
    }));

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
