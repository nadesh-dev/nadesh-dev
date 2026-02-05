# 🎵 Music Streaming Application - Project Overview

## Quick Start

This repository now contains a **full-stack music streaming web application** similar to Spotify.

### 🚀 Get Started in 3 Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup PostgreSQL database and seed data**
   ```bash
   ./setup.sh
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Demo Credentials
- **Email:** demo@example.com
- **Password:** password123

---

## 📚 Full Documentation

For complete documentation, see [MUSIC_APP_README.md](./MUSIC_APP_README.md)

## 🎯 What's Included

### Frontend (React + TypeScript)
- ✅ Modern UI with dark theme
- ✅ Responsive design
- ✅ Full music player with controls
- ✅ Search functionality
- ✅ Playlist management
- ✅ User authentication

### Backend (Node.js + Express)
- ✅ RESTful API
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ Complete CRUD operations
- ✅ Secure password hashing

### Database
- ✅ PostgreSQL schema
- ✅ Migrations
- ✅ Sample data seeding

## 📁 Project Structure

```
music-streaming-app/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── database/  # DB connection & schema
│   │   └── middleware/
│   └── package.json
│
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/     # State management
│   │   └── lib/       # Utilities
│   └── package.json
│
└── package.json       # Root workspace config
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed sample data

# Build
npm run build            # Build both frontend & backend
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
```

## 🎨 Features

### Core MVP Features ✅
- [x] User authentication (signup, login, logout)
- [x] Music player with full controls
- [x] Browse tracks, albums, and artists
- [x] Search functionality
- [x] Create and manage playlists
- [x] Favorite tracks
- [x] Listening history
- [x] Responsive design

### Player Features
- [x] Play/Pause/Skip controls
- [x] Progress bar with seeking
- [x] Volume control
- [x] Repeat modes (off, all, one)
- [x] Shuffle
- [x] Queue management

## 🔧 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS |
| State | Zustand |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT, Bcrypt |
| API Client | Axios |

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Ensure PostgreSQL is running
sudo service postgresql start

# Or on macOS
brew services start postgresql
```

### Port Already in Use
Edit `backend/.env` and change `PORT=5000` to another port.

### Dependencies Issues
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

## 📝 Environment Variables

Backend requires a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_streaming
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

An example file is provided at `backend/.env.example`.

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/popular` - Get popular tracks
- `GET /api/tracks/:id` - Get track details
- `POST /api/tracks/:id/play` - Record play

### Playlists
- `GET /api/playlists/my-playlists` - Get user playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove track

### Artists & Albums
- `GET /api/artists` - List artists
- `GET /api/artists/:id` - Get artist details
- `GET /api/albums` - List albums
- `GET /api/albums/:id` - Get album details

### Search
- `GET /api/search?q=query` - Search all
- `GET /api/search?q=query&type=tracks` - Search tracks only

### User
- `GET /api/users/favorites` - Get favorite tracks
- `POST /api/users/favorites/:trackId` - Add favorite
- `DELETE /api/users/favorites/:trackId` - Remove favorite
- `GET /api/users/history` - Get listening history

## 🔐 Security

- JWT token-based authentication
- Bcrypt password hashing (10 rounds)
- Protected routes with authentication middleware
- CORS configured
- SQL injection prevention with parameterized queries
- Input validation with express-validator

## 📈 Database Schema

8 main tables:
- **users** - User accounts
- **artists** - Music artists
- **albums** - Music albums
- **tracks** - Individual songs
- **playlists** - User playlists
- **playlist_tracks** - Playlist-track relationships
- **user_favorites** - User favorite tracks
- **listening_history** - Play history

## 🚀 Deployment

### Backend
1. Build: `npm run build:backend`
2. Set production environment variables
3. Run: `npm run start:backend`

### Frontend
1. Build: `npm run build:frontend`
2. Deploy `frontend/dist` folder to static hosting (Netlify, Vercel, etc.)
3. Update API URL in frontend configuration

### Database
1. Create PostgreSQL database on hosting provider
2. Run migrations
3. Update connection string in backend `.env`

## 🎓 Learning Resources

This project demonstrates:
- Full-stack TypeScript development
- RESTful API design
- JWT authentication
- React state management with Zustand
- PostgreSQL database design
- Modern React patterns (hooks, context)
- Responsive web design
- Audio playback in the browser

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Need help?** Check the full documentation in [MUSIC_APP_README.md](./MUSIC_APP_README.md)
