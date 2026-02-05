# 🎵 Welcome to Your Music Streaming App!

## 👋 Start Here

This repository contains a **complete, production-ready music streaming web application** similar to Spotify!

---

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites
- Node.js >= 18
- PostgreSQL >= 12
- npm >= 9

### 2. Run Setup
```bash
# One-command setup
./setup.sh

# Or manual setup
npm install
npm run db:migrate
npm run db:seed
```

### 3. Start App
```bash
npm run dev
```

### 4. Open & Login
- Open http://localhost:5173
- Login with: `demo@example.com` / `password123`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 5-minute setup guide |
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | Project summary |
| **[MUSIC_APP_README.md](./MUSIC_APP_README.md)** | Complete documentation |
| **[FEATURES.md](./FEATURES.md)** | Feature checklist |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | Technical details |

---

## 🎯 What You Get

### ✨ Features
- 🔐 User authentication (signup/login)
- 🎵 Full music player with controls
- 🔍 Search tracks, artists, albums
- 📝 Create and manage playlists
- ❤️ Favorite tracks
- 📊 Listening history
- 🎨 Beautiful dark UI (Spotify-inspired)
- 📱 Responsive design

### 🛠️ Tech Stack
- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **State:** Zustand
- **Auth:** JWT + Bcrypt

---

## 🚀 Commands

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend only (port 5173)
npm run dev:backend      # Backend only (port 5000)

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Add sample data

# Build
npm run build            # Build for production
```

---

## 📂 Project Structure

```
music-streaming-app/
├── backend/           # Express API + PostgreSQL
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── database/  # Schema & migrations
│   │   └── middleware/
│   └── .env           # Configuration
│
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/     # State management
│   │   └── lib/       # API & utilities
│   └── vite.config.ts
│
└── docs/              # Documentation
```

---

## 🎮 Try It Out

1. **Browse Music** - Check out the home page with popular tracks
2. **Search** - Find your favorite artists, albums, or tracks
3. **Create Playlist** - Click "Create Playlist" in sidebar
4. **Play Music** - Click any track to start playing
5. **Like Songs** - Heart icon to add to favorites
6. **Manage Queue** - Use player controls at bottom

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
DB_NAME=music_streaming
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
```

### Database
```bash
# Create database
psql -U postgres
CREATE DATABASE music_streaming;
```

---

## 🐛 Troubleshooting

### PostgreSQL not running?
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start
```

### Port already in use?
Edit `backend/.env` and change `PORT=5000` to another port.

### Database connection failed?
Check your credentials in `backend/.env`

### More help?
See [QUICKSTART.md](./QUICKSTART.md) for detailed troubleshooting.

---

## 📊 What's Inside

- **32 TypeScript/TSX files**
- **8 Frontend pages** (Home, Search, Library, etc.)
- **7 API route modules** (Auth, Tracks, Playlists, etc.)
- **8 Database tables** (Users, Tracks, Artists, etc.)
- **20+ API endpoints**
- **5+ Reusable components**
- **Full authentication system**
- **Complete music player**

---

## 🎓 Learn From This Project

This app demonstrates:
- Full-stack TypeScript development
- RESTful API design
- JWT authentication
- PostgreSQL database design
- React state management (Zustand)
- Responsive UI with TailwindCSS
- Audio playback in browsers
- Monorepo structure

---

## ✨ Features Implemented

✅ User registration & login
✅ JWT authentication
✅ Music player (play/pause/skip/volume)
✅ Progress bar & seeking
✅ Repeat & shuffle modes
✅ Queue management
✅ Search (tracks/artists/albums)
✅ Playlists (create/edit/delete)
✅ Favorite tracks
✅ Listening history
✅ Responsive design
✅ Dark theme
✅ Sample data included

---

## 🚀 Ready to Deploy?

### Production Build
```bash
npm run build
```

### Deploy Backend
- Build: `npm run build:backend`
- Run: `npm run start:backend`
- Environment: Set production `.env`

### Deploy Frontend
- Build: `npm run build:frontend`
- Serve: Deploy `frontend/dist` to any static host
- Providers: Vercel, Netlify, AWS S3, etc.

---

## 📞 Need Help?

1. Check [QUICKSTART.md](./QUICKSTART.md) for setup issues
2. Read [MUSIC_APP_README.md](./MUSIC_APP_README.md) for full docs
3. See [FEATURES.md](./FEATURES.md) for what's implemented
4. Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for technical details

---

## 🎉 You're All Set!

Run `npm run dev` and start building your music empire! 🎵

**Demo Login:**
- Email: demo@example.com
- Password: password123

Happy streaming! 🎶
