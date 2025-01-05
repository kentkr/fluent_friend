#!/bin/sh

# this doesnt work currently. Just need to set env var
# but its not necessary right now
#echo 'Waiting for postgres...'
#while ! nc -z "$DB_HOSTNAME" "$DB_PORT"; do
#  sleep 0.1
#done
#
#echo "PostgreSQL started"

echo 'PostgreSQL started'

echo 'Running migrations...'
python manage.py migrate

echo 'Collecting static files...'
python manage.py collectstatic --no-input

echo 'Starting server...'
python3 manage.py tailwind start &
python manage.py runserver 0.0.0.0:8000

exec "$@"
