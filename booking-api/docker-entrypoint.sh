#!/bin/sh
set -e

echo "=== Starting Laravel Application ==="

# Generate .env file dari environment variables yang di-set di Railway
# Ini diperlukan karena php artisan serve tidak selalu meneruskan
# container env vars ke proses PHP
echo "Generating .env from runtime environment variables..."
env | grep -E '^(APP_|DB_|MYSQL|SESSION_|CACHE_|QUEUE_|MAIL_|REDIS_|LOG_|BROADCAST_|FILESYSTEM_|MIDTRANS_|SANCTUM_|FRONTEND_|BCRYPT_|VITE_)' > /var/www/html/.env 2>/dev/null || true

# Tambahkan APP_KEY jika belum ada di .env
if ! grep -q "APP_KEY" /var/www/html/.env 2>/dev/null; then
    echo "APP_KEY=" >> /var/www/html/.env
fi

echo "Generated .env contents (passwords hidden):"
cat /var/www/html/.env | sed 's/PASSWORD=.*/PASSWORD=***hidden***/' | sed 's/SERVER_KEY=.*/SERVER_KEY=***hidden***/' | sed 's/APP_KEY=.*/APP_KEY=***hidden***/'

# Clear all caches untuk membaca .env yang baru
php artisan optimize:clear 2>&1 || true

# Jalankan migrasi database
echo "Running database migrations..."
php artisan migrate --force 2>&1 || echo "Migration failed or skipped"

# Jalankan seeder
echo "Running database seeders..."
php artisan db:seed --force 2>&1 || echo "Seeding failed or skipped"

echo "=== Application Ready ==="

exec "$@"
