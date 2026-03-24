#!/bin/bash

APP_NAME="digital-bit-landing"
PORT=3000

echo "🚀 Starting deployment for Digital Bit Solutions..."

# Extract ZIP if exists
if [ -f "dist.zip" ]; then
    echo "📦 Extracting dist.zip..."
    unzip -o dist.zip
    # rm dist.zip
else
    echo "⚠️ dist.zip not found! Continuing..."
fi

# Ensure .htaccess is present (already in ZIP if correctly prepared)
if [ ! -f ".htaccess" ]; then
    echo "⚠️ .htaccess missing. Creating one for Apache proxy..."
    cat > .htaccess <<EOF
DirectoryIndex disabled
RewriteEngine On
RewriteCond %{ENV:REDIRECT_STATUS} ^$
RewriteRule ^(.*)$ http://127.0.0.1:3000/\$1 [P,L]
EOF
fi

# Kill old process if running on port 3000
echo "⚙️ Cleaning up port $PORT..."
fuser -k $PORT/tcp 2>/dev/null

# Start the server
echo "⚡ Starting Next.js server..."
# Using nohup as a fallback if PM2 is not available
if command -v pm2 &> /dev/null; then
    pm2 delete $APP_NAME 2>/dev/null
    pm2 start server.js --name "$APP_NAME"
    pm2 save
else
    nohup node server.js > app.log 2>&1 &
fi

echo "✅ Deployment finished successfully."
