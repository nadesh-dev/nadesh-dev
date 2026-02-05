import { Router } from 'express';
import { pool } from '../database/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-playlists', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    
    const result = await pool.query(
      `SELECT 
        p.id, p.name, p.description, p.cover_url, p.is_public, p.created_at,
        COUNT(pt.track_id) as track_count
      FROM playlists p
      LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [userId]
    );

    const playlists = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      coverUrl: row.cover_url,
      isPublic: row.is_public,
      trackCount: parseInt(row.track_count),
      createdAt: row.created_at
    }));

    res.json(playlists);
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { name, description, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const result = await pool.query(
      `INSERT INTO playlists (user_id, name, description, is_public)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, cover_url, is_public, created_at`,
      [userId, name, description || null, isPublic || false]
    );

    const playlist = result.rows[0];
    res.status(201).json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverUrl: playlist.cover_url,
      isPublic: playlist.is_public,
      trackCount: 0,
      createdAt: playlist.created_at
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const playlistResult = await pool.query(
      `SELECT 
        p.id, p.name, p.description, p.cover_url, p.is_public, p.created_at,
        u.username, u.display_name
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1`,
      [id]
    );

    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const playlist = playlistResult.rows[0];

    const tracksResult = await pool.query(
      `SELECT 
        t.id, t.title, t.duration, t.file_url, t.cover_url,
        a.id as artist_id, a.name as artist_name,
        al.id as album_id, al.title as album_title,
        pt.position, pt.added_at
      FROM playlist_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE pt.playlist_id = $1
      ORDER BY pt.position`,
      [id]
    );

    const tracks = tracksResult.rows.map(row => ({
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
      position: row.position,
      addedAt: row.added_at
    }));

    res.json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverUrl: playlist.cover_url,
      isPublic: playlist.is_public,
      owner: {
        username: playlist.username,
        displayName: playlist.display_name
      },
      tracks,
      createdAt: playlist.created_at
    });
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { name, description, isPublic } = req.body;

    const checkOwnership = await pool.query(
      'SELECT user_id FROM playlists WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (checkOwnership.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this playlist' });
    }

    const result = await pool.query(
      `UPDATE playlists 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           is_public = COALESCE($3, is_public),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, name, description, cover_url, is_public, created_at`,
      [name, description, isPublic, id]
    );

    const playlist = result.rows[0];
    res.json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverUrl: playlist.cover_url,
      isPublic: playlist.is_public,
      createdAt: playlist.created_at
    });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const checkOwnership = await pool.query(
      'SELECT user_id FROM playlists WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (checkOwnership.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this playlist' });
    }

    await pool.query('DELETE FROM playlists WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

router.post('/:id/tracks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { trackId } = req.body;

    const checkOwnership = await pool.query(
      'SELECT user_id FROM playlists WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (checkOwnership.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    const positionResult = await pool.query(
      'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM playlist_tracks WHERE playlist_id = $1',
      [id]
    );

    const position = positionResult.rows[0].next_position;

    await pool.query(
      'INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES ($1, $2, $3) ON CONFLICT (playlist_id, track_id) DO NOTHING',
      [id, trackId, position]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Add track to playlist error:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

router.delete('/:id/tracks/:trackId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id, trackId } = req.params;
    const userId = req.user?.id;

    const checkOwnership = await pool.query(
      'SELECT user_id FROM playlists WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (checkOwnership.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    await pool.query(
      'DELETE FROM playlist_tracks WHERE playlist_id = $1 AND track_id = $2',
      [id, trackId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Remove track from playlist error:', error);
    res.status(500).json({ error: 'Failed to remove track from playlist' });
  }
});

export default router;
