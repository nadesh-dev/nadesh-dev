# 🎵 Music Streaming Web Application

A full-stack music streaming application similar to Spotify, built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

### Core Features (MVP)

1. **User Authentication**
   - Sign up, login, logout functionality
   - JWT-based session management
   - Secure password hashing with bcrypt
   - User profiles with personalized data

2. **Music Library & Catalog**
   - Browse available tracks with metadata (artist, album, duration)
   - View music by albums and artists
   - Mock data with sample songs

3. **Music Player**
   - Full playback controls (play, pause, skip, previous)
   - Interactive progress bar with timeline scrubbing
   - Volume control
   - Current track display with artwork
   - Repeat modes (off, all, one)
   - Shuffle functionality

4. **Playlists**
   - Create, edit, delete playlists
   - Add/remove tracks from playlists
   - View all user playlists
   - Save favorite tracks

5. **Search & Discovery**
   - Search for tracks, artists, and albums
   - Browse popular/trending tracks
   - View listening history

6. **UI/UX**
   - Responsive design (desktop-first, mobile-friendly)
   - Dark theme inspired by Spotify
   - Smooth transitions and animations
   - Modern, clean interface

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Zustand** for state management
- **Axios** for API calls
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
music-streaming-app/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── connection.ts      # Database connection pool
│   │   │   ├── schema.sql         # Database schema
│   │   │   ├── migrate.ts         # Migration runner
│   │   │   └── seed.ts            # Seed data
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # Authentication endpoints
│   │   │   ├── track.routes.ts    # Track endpoints
│   │   │   ├── playlist.routes.ts # Playlist endpoints
│   │   │   ├── artist.routes.ts   # Artist endpoints
│   │   │   ├── album.routes.ts    # Album endpoints
│   │   │   ├── search.routes.ts   # Search endpoints
│   │   │   └── user.routes.ts     # User endpoints
│   │   └── index.ts               # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Main layout wrapper
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   ├── Player.tsx         # Music player component
│   │   │   ├── TrackList.tsx      # Track list display
│   │   │   └── TrackCard.tsx      # Track card component
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # Home/discovery page
│   │   │   ├── SearchPage.tsx     # Search page
│   │   │   ├── LibraryPage.tsx    # User library
│   │   │   ├── ArtistPage.tsx     # Artist detail page
│   │   │   ├── AlbumPage.tsx      # Album detail page
│   │   │   ├── PlaylistPage.tsx   # Playlist detail page
│   │   │   ├── LoginPage.tsx      # Login page
│   │   │   └── RegisterPage.tsx   # Registration page
│   │   ├── store/
│   │   │   ├── authStore.ts       # Authentication state
│   │   │   └── playerStore.ts     # Player state
│   │   ├── lib/
│   │   │   ├── api.ts             # API client
│   │   │   └── utils.ts           # Utility functions
│   │   ├── App.tsx                # App root component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
│
├── package.json                    # Root package.json (workspace)
├── .gitignore
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12

### 1. Clone the Repository

```bash
git clone <repository-url>
cd music-streaming-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend using npm workspaces.

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE music_streaming;

# Exit psql
\q
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_streaming
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Run Migrations

```bash
npm run db:migrate
```

#### Seed Database with Sample Data

```bash
npm run db:seed
```

This will create:
- 2 demo users
- 5 artists
- 5 albums
- 12 tracks

### 4. Start Development Servers

From the root directory:

```bash
npm run dev
```

This will start both backend and frontend servers concurrently:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Alternatively, start them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 📝 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "displayName": "Display Name"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Track Endpoints

```http
GET /api/tracks                    # Get all tracks
GET /api/tracks/popular            # Get popular tracks
GET /api/tracks/:id                # Get track by ID
POST /api/tracks/:id/play          # Record play (requires auth)
```

### Playlist Endpoints

```http
GET /api/playlists/my-playlists    # Get user playlists (requires auth)
GET /api/playlists/:id             # Get playlist by ID
POST /api/playlists                # Create playlist (requires auth)
PUT /api/playlists/:id             # Update playlist (requires auth)
DELETE /api/playlists/:id          # Delete playlist (requires auth)
POST /api/playlists/:id/tracks     # Add track to playlist (requires auth)
DELETE /api/playlists/:id/tracks/:trackId  # Remove track (requires auth)
```

### Artist Endpoints

```http
GET /api/artists                   # Get all artists
GET /api/artists/:id               # Get artist by ID with tracks and albums
```

### Album Endpoints

```http
GET /api/albums                    # Get all albums
GET /api/albums/:id                # Get album by ID with tracks
```

### Search Endpoint

```http
GET /api/search?q=query&type=all   # Search (type: all, tracks, artists, albums)
```

### User Endpoints

```http
GET /api/users/favorites           # Get favorite tracks (requires auth)
POST /api/users/favorites/:trackId # Add favorite (requires auth)
DELETE /api/users/favorites/:trackId # Remove favorite (requires auth)
GET /api/users/history             # Get listening history (requires auth)
```

## 🎯 Demo Credentials

After seeding the database, you can login with:

**Email:** demo@example.com  
**Password:** password123

## 🗄️ Database Schema

### Users
- id, email, password (hashed), username, display_name, avatar_url

### Artists
- id, name, bio, image_url

### Albums
- id, title, artist_id, cover_url, release_date

### Tracks
- id, title, artist_id, album_id, duration, file_url, cover_url, play_count

### Playlists
- id, user_id, name, description, cover_url, is_public

### Playlist Tracks
- id, playlist_id, track_id, position

### User Favorites
- id, user_id, track_id

### Listening History
- id, user_id, track_id, played_at

## 🚀 Build for Production

### Build Backend

```bash
npm run build:backend
```

### Build Frontend

```bash
npm run build:frontend
```

### Start Production Server

```bash
npm run start:backend
```

The frontend build will be in `frontend/dist` and can be served by any static file server.

## 🎨 Features in Detail

### Music Player
- Real-time playback with HTML5 Audio API
- Progress tracking and seeking
- Volume control
- Queue management
- Repeat modes (off, repeat all, repeat one)
- Shuffle functionality
- Persistent state across page navigation

### Playlists
- Create unlimited playlists
- Drag-and-drop support for reordering
- Public/private playlist settings
- Share playlists with other users

### Search
- Real-time search with debouncing
- Search across tracks, artists, and albums
- Filter results by type

### Responsive Design
- Mobile-friendly layout
- Touch-optimized controls
- Adaptive grid layouts

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Protected API routes
- CORS configuration
- SQL injection prevention with parameterized queries
- Input validation with express-validator

## 🐛 Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running:
```bash
# On macOS
brew services start postgresql

# On Ubuntu/Debian
sudo service postgresql start

# On Windows
# Start PostgreSQL from Services
```

### Port Already in Use

If port 5000 or 5173 is in use, you can change them:

Backend: Edit `backend/.env`:
```env
PORT=5001
```

Frontend: Edit `frontend/vite.config.ts`:
```ts
server: {
  port: 5174
}
```

### Module Not Found Errors

Delete node_modules and reinstall:
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

## 📚 Future Enhancements

- [ ] File upload for custom music
- [ ] Social features (follow users, share playlists)
- [ ] Advanced recommendations
- [ ] Lyrics display
- [ ] Equalizer and audio effects
- [ ] Offline mode with PWA
- [ ] Mobile apps (React Native)
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Integration with music APIs (Spotify, Apple Music)

## 📄 License

MIT

## 👤 Author

Your Name

## 🙏 Acknowledgments

- Design inspired by Spotify
- Icons by Lucide
- Sample images from Picsum and Pravatar

---

Happy streaming! 🎵🎶
