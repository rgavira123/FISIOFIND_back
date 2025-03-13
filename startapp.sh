#!/bin/bash
# Activate the virtual environment
source venv/bin/activate

# Apply migrations (optional)
python manage.py migrate

# Start Gunicorn WSGI server
gunicorn --workers=3 --bind=0.0.0.0:8000 myproject.wsgi