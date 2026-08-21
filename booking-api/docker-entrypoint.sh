#!/bin/bash
set -e

# Sesuaikan port Apache dengan variabel $PORT dari Railway
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:$PORT>/g" /etc/apache2/sites-available/000-default.conf

# Cache config & route saat runtime jika APP_KEY tersedia
if [ -n "$APP_KEY" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
fi

# Jalankan migrasi otomatis jika DB terhubung
if [ -n "$DB_HOST" ] || [ -n "$MYSQLHOST" ]; then
    php artisan migrate --force || true
    php artisan db:seed --force || true
fi

exec "$@"
