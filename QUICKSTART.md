# 🚀 Quick Start Guide

Get the music streaming app running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need >= 18)
node --version

# Check npm version (need >= 9)
npm --version

# Check if PostgreSQL is installed
psql --version
```

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all dependencies for both frontend and backend.

## Step 2: Setup Database (2 minutes)

### Option A: Automated Setup (Recommended)

```bash
./setup.sh
```

### Option B: Manual Setup

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE music_streaming;
\q

# Configure backend/.env
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

## Step 3: Start Development (1 minute)

```bash
npm run dev
```

This starts both servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🎉 Done!

Open http://localhost:5173 and login with:
- **Email:** demo@example.com
- **Password:** password123

## Common Issues

### PostgreSQL Not Running

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo service postgresql start
```

**Windows:**
Start PostgreSQL from Services

### Port Already in Use

Edit `backend/.env`:
```env
PORT=5001  # Change to any available port
```

### Database Connection Failed

Check your `backend/.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_streaming
DB_USER=postgres
DB_PASSWORD=your_password  # Update this!
```

## Next Steps

1. 🎵 Browse music on the home page
2. 🔍 Search for tracks, artists, or albums
3. 📝 Create your first playlist
4. ❤️ Like your favorite songs
5. 🎨 Explore the music player features

## Need More Help?

- Full documentation: [MUSIC_APP_README.md](./MUSIC_APP_README.md)
- Project overview: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- Check logs in terminal for error messages

## Development Tips

```bash
# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Reset database (warning: deletes all data!)
npm run db:migrate && npm run db:seed
```

Enjoy building your music streaming app! 🎶
