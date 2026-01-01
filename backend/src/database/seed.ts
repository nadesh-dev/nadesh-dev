import { pool } from './connection';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await pool.query(`
      INSERT INTO users (email, password, username, display_name, avatar_url)
      VALUES 
        ('demo@example.com', $1, 'demouser', 'Demo User', 'https://i.pravatar.cc/300?img=1'),
        ('john@example.com', $1, 'johndoe', 'John Doe', 'https://i.pravatar.cc/300?img=2')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);

    await pool.query(`
      INSERT INTO artists (name, bio, image_url)
      VALUES 
        ('The Midnight', 'Synthwave duo creating nostalgic electronic music', 'https://picsum.photos/seed/artist1/400/400'),
        ('Chillhop Beats', 'Lo-fi hip hop for study and relaxation', 'https://picsum.photos/seed/artist2/400/400'),
        ('Neon Dreams', 'Retro-futuristic electronic music collective', 'https://picsum.photos/seed/artist3/400/400'),
        ('Jazz Café', 'Smooth jazz for any occasion', 'https://picsum.photos/seed/artist4/400/400'),
        ('Electric Avenue', 'Modern electronic and house music', 'https://picsum.photos/seed/artist5/400/400')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);

    const artistsResult = await pool.query('SELECT id FROM artists ORDER BY id LIMIT 5');
    const artistIds = artistsResult.rows.map(row => row.id);

    await pool.query(`
      INSERT INTO albums (title, artist_id, cover_url, release_date)
      VALUES 
        ('Endless Summer', $1, 'https://picsum.photos/seed/album1/400/400', '2023-06-15'),
        ('Nocturnal', $2, 'https://picsum.photos/seed/album2/400/400', '2023-03-20'),
        ('Neon Nights', $3, 'https://picsum.photos/seed/album3/400/400', '2023-09-10'),
        ('Smooth Sessions', $4, 'https://picsum.photos/seed/album4/400/400', '2023-01-05'),
        ('Digital Dreams', $5, 'https://picsum.photos/seed/album5/400/400', '2023-11-22')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `, artistIds);

    const albumsResult = await pool.query('SELECT id FROM albums ORDER BY id LIMIT 5');
    const albumIds = albumsResult.rows.map(row => row.id);

    const tracks = [
      ['Sunset Drive', artistIds[0], albumIds[0], 245, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://picsum.photos/seed/track1/400/400'],
      ['Ocean Breeze', artistIds[0], albumIds[0], 198, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://picsum.photos/seed/track2/400/400'],
      ['Midnight City', artistIds[0], albumIds[0], 267, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://picsum.photos/seed/track3/400/400'],
      ['Lofi Beats 1', artistIds[1], albumIds[1], 180, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://picsum.photos/seed/track4/400/400'],
      ['Study Session', artistIds[1], albumIds[1], 195, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://picsum.photos/seed/track5/400/400'],
      ['Rainy Day', artistIds[1], albumIds[1], 210, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://picsum.photos/seed/track6/400/400'],
      ['Neon Lights', artistIds[2], albumIds[2], 234, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'https://picsum.photos/seed/track7/400/400'],
      ['Cyber Dreams', artistIds[2], albumIds[2], 256, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'https://picsum.photos/seed/track8/400/400'],
      ['Smooth Jazz', artistIds[3], albumIds[3], 290, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 'https://picsum.photos/seed/track9/400/400'],
      ['Evening Mood', artistIds[3], albumIds[3], 315, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 'https://picsum.photos/seed/track10/400/400'],
      ['Electric Feel', artistIds[4], albumIds[4], 223, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://picsum.photos/seed/track11/400/400'],
      ['Digital Love', artistIds[4], albumIds[4], 241, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://picsum.photos/seed/track12/400/400'],
    ];

    for (const track of tracks) {
      await pool.query(`
        INSERT INTO tracks (title, artist_id, album_id, duration, file_url, cover_url, play_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING;
      `, [...track, Math.floor(Math.random() * 10000)]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('📧 Demo user: demo@example.com');
    console.log('🔑 Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
