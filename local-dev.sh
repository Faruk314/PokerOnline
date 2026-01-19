#!/bin/bash
set -e

# Function to handle script termination (Ctrl+C)
cleanup() {
    echo ""
    echo "Stopping services..."
    # Kill the background processes
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
    fi
    echo "Services stopped."
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

echo "=========================================="
echo "   Starting Local Development Environment"
echo "=========================================="

# 1. Start Backend Services
echo "[Backend] Starting Docker containers..."
cd backend
docker compose up -d

echo "[Backend] Starting backend server..."
pnpm run dev &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "[Frontend] Starting frontend server..."
cd frontend
pnpm run dev &
FRONTEND_PID=$!
cd ..

echo "=========================================="
echo "   Both services are running!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo "   Press Ctrl+C to stop everything."
echo "=========================================="

# Wait for both processes to keep the script running
wait $BACKEND_PID $FRONTEND_PID
