#!/bin/sh
set -e

# Selalu clear cache config agar membaca variabel runtime terbaru dari Railway
php artisan optimize:clear || true

# Jalankan migrasi database otomatis saat startup
echo "Checking database connection and running migrations..."
php artisan migrate --force || true
php artisan db:seed --force || true

exec "$@"
