#!/bin/sh
set -e

# Cache config & route jika APP_KEY ada
if [ -n "$APP_KEY" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
fi

# Jalankan migrasi database otomatis saat startup
if [ -n "$DB_HOST" ] || [ -n "$MYSQLHOST" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
    php artisan db:seed --force || true
fi

exec "$@"
