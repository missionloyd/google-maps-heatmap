#!/bin/sh

# Replace YOUR_API_KEY in index.html with actual API key from environment
if [ -n "$GOOGLE_MAPS_API_KEY" ]; then
    echo "Injecting Google Maps API key into HTML..."
    sed -i "s/YOUR_API_KEY/${GOOGLE_MAPS_API_KEY}/g" /usr/share/nginx/html/index.html
else
    echo "Warning: GOOGLE_MAPS_API_KEY environment variable not set"
fi

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;"
