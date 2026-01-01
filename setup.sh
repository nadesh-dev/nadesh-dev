#!/bin/bash

echo "🎵 Music Streaming App - Setup Script"
echo "====================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required"
    exit 1
fi
echo "✅ Node.js version OK"
echo ""

# Check PostgreSQL
echo "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL first."
    exit 1
fi
echo "✅ PostgreSQL found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Setup database
echo "🗄️  Setting up database..."
echo "Enter PostgreSQL password when prompted..."

# Create database
psql -U postgres -c "CREATE DATABASE music_streaming;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database created"
else
    echo "ℹ️  Database may already exist"
fi
echo ""

# Run migrations
echo "🔄 Running database migrations..."
cd backend
npm run migrate
if [ $? -ne 0 ]; then
    echo "❌ Migration failed"
    exit 1
fi
echo "✅ Migrations completed"
echo ""

# Seed database
echo "🌱 Seeding database with sample data..."
npm run seed
if [ $? -ne 0 ]; then
    echo "❌ Seeding failed"
    exit 1
fi
echo "✅ Database seeded"
echo ""

cd ..

echo "✨ Setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "🔐 Demo login credentials:"
echo "   Email:    demo@example.com"
echo "   Password: password123"
echo ""
