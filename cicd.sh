#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

# Configuration
REMOTE_USER="root"
REMOTE_HOST="192.168.10.57"
REMOTE_PORT="22"

# Paths on the remote server
REMOTE_DEST_FRONTEND="/var/www/poker.farukspahic.com"
REMOTE_DEST_BACKEND="/opt/poker"

function deploy_frontend() {
    echo "=============================="
    echo "   Deploying Frontend..."
    echo "=============================="
    
    # Navigate to frontend directory
    if [ -d "frontend" ]; then
        cd frontend
    else
        echo "Error: 'frontend' directory not found."
        exit 1
    fi

    # Install dependencies
    echo "Step 1: Installing frontend dependencies..."
    pnpm i

    # Build the project
    echo "Step 2: Building frontend project with production mode..."
    # We load variables from .env.production during build by default if vite uses it, 
    # or we can explicitly copy/symlink it if needed. 
    # Vite automatically loads .env.production when running 'vite build' (which pnpm build calls).
    # To be safe, we can ensure the build mode is production.
    pnpm build --mode production

    # Sync files to remote server
    echo "Step 3: Transferring frontend dist to ${REMOTE_HOST}..."
    rsync -avz -e "ssh -p ${REMOTE_PORT}" dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_FRONTEND}"

    # Reload Nginx
    echo "Step 4: Reloading Nginx..."
    ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "systemctl reload nginx"

    # Return to root
    cd ..
    echo "Frontend deployment complete."
}

function deploy_backend() {
    echo "=============================="
    echo "   Deploying Backend..."
    echo "=============================="

    if [ ! -d "backend" ]; then
        echo "Error: 'backend' directory not found."
        exit 1
    fi

    # Sync files to remote server
    # We exclude node_modules and just sync source code and config
    echo "Step 1: Transferring backend source to ${REMOTE_HOST}..."
    rsync -avz -e "ssh -p ${REMOTE_PORT}" \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'dist' \
        backend/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}"

    # Copy .env.production file as .env to ensure it exists for migrations and runtime
    echo "Step 1.5: Copying .env.production to remote as .env..."
    scp -P "${REMOTE_PORT}" backend/.env.production "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}/.env"


    echo "Step 2: Installing dependencies and building on remote server..."
    ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
        mkdir -p /var/log/poker &&
        cd ${REMOTE_DEST_BACKEND} &&
        pnpm install &&
        pnpm build &&
        echo "Running database migrations..." &&
        pnpm db:migrate &&
        pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    "

    echo "Backend deployment complete."
}


# Main logic
case "$1" in
    frontend)
        deploy_frontend
        ;;
    backend)
        deploy_backend
        ;;
    all)
        deploy_frontend
        deploy_backend
        ;;
    *)
        echo "Usage: $0 {frontend|backend|set}"
        echo "Example: ./cicd.sh frontend"
        exit 1
        ;;
esac
