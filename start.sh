#!/bin/bash

echo "🚀 Starting Food Delivery System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to API directory
cd food-api

echo "📦 Installing API dependencies..."
npm install

echo "🐳 Starting Docker services..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️ Setting up database..."
npm run db:generate
npm run db:push

echo "🌱 Seeding database with sample data..."
npm run db:seed

echo "🔧 Starting API server..."
npm run dev &

# Navigate to Admin directory
cd ../food-admin

echo "📦 Installing Admin dependencies..."
npm install

echo "🎨 Starting Admin panel..."
npm run dev &

echo "✅ All services started!"
echo ""
echo "🌐 Access URLs:"
echo "   - Admin Panel: http://localhost:5173"
echo "   - API: http://localhost:3000"
echo "   - Adminer (DB): http://localhost:8080"
echo ""
echo "📊 Database credentials for Adminer:"
echo "   - Server: postgres"
echo "   - Username: food_user"
echo "   - Password: food_password"
echo "   - Database: food_db"
echo ""
echo "Press Ctrl+C to stop all services"
