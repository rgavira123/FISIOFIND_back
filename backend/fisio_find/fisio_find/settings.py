from datetime import timedelta
from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

# Cargar variables de entorno desde el archivo .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Configuración básica
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-temporary-key-for-deployment')
PAYMENT_API_KEY = os.getenv("PAYMENT_API_KEY", 'key')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'fisiofind-backend.azurewebsites.net',
    'fisiofind.netlify.app',
    '138.68.80.34',
    '167.99.246.186',
    's2.fisiofind.com',
    's2-api.fisiofind.com',
    's3.fisiofind.com',
    's3-api.fisiofind.com'
]

CSRF_TRUSTED_ORIGINS = [
    "https://fisiofind-backend.azurewebsites.net",
    "http://138.68.80.34",
    "http://167.99.246.186",
    "https://s2.fisiofind.com",
    "https://s2-api.fisiofind.com",
    "wss://s2-api.fisiofind.com",
    "wss://s3-api.fisiofind.com",
    "https://s3.fisiofind.com",
    "https://s3-api.fisiofind.com"
    
]
SECURE_PROXY_SSL_HEADER = ("X-Forwarded-Proto", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_USE_SESSIONS = True

# Application definition
INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'videocall',
]

# Django REST Framework
INSTALLED_APPS += [
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
]

# Apps propias
INSTALLED_APPS += [
    'users',
    'appointment',
    'terms',
    'guest_session',
    'treatments',
    'gestion_survey',
    'payment',
]


# Otras apps
INSTALLED_APPS += [
    'corsheaders',
    'django_extensions',
    'django_filters',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

# Configuración adicional de CORS
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
         'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
         'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ("Bearer",),
}

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://fisiofind-backend.azurewebsites.net",
    "https://fisiofind.netlify.app",
    "http://138.68.80.34",
    "http://167.99.246.186",
    "https://s2-api.fisiofind.com",
    "https://s2.fisiofind.com",
    "wss://s2-api.fisiofind.com",
    "https://s3-api.fisiofind.com",
    "https://s3.fisiofind.com",
    "wss://s3-api.fisiofind.com"
    
]

ROOT_URLCONF = 'fisio_find.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fisio_find.wsgi.application'
ASGI_APPLICATION = 'fisio_find.asgi.application'

# Configurar Redis como backend de WebSockets
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

# Configuración de la base de datos
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME', 'postgres'),
        'USER': os.getenv('DATABASE_USER', 'postgres'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
        'HOST': os.getenv('DATABASE_HOST', 'localhost'),
        'PORT': os.getenv('DATABASE_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require' if not DEBUG else 'prefer',
        },
    }
}

# Configuración del servicio de correos
EMAIL_BACKEND  = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = os.getenv('EMAIL_PORT')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)

AUTH_USER_MODEL = 'users.AppUser'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'Europe/Madrid'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = "/root/FISIOFIND_back/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


#Stripe payment
STRIPE_PUBLIC_KEY = os.getenv('STRIPE_PUBLIC_KEY')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')




DIGITALOCEAN_ACCESS_KEY_ID = "DO801T22Y6LWLUV2R4RE"
DIGITALOCEAN_SECRET_ACCESS_KEY = "hHkSrRsu61YP+BqQP3GL+GtGeqDfzPVpn8sMaLDVkVY"
DIGITALOCEAN_SPACE_NAME = "fisiofind-repo"
DIGITALOCEAN_REGION = "fra1"  # Ejemplo: nyc3, ams3, sgp1
DIGITALOCEAN_ENDPOINT_URL = f"https://{DIGITALOCEAN_SPACE_NAME}.{DIGITALOCEAN_REGION}.digitaloceanspaces.com"

# Configuración de almacenamiento en DigitalOcean Spaces
DEFAULT_FILE_STORAGE = "backend.custom_storages.DigitalOceanMediaStorage"
MEDIA_URL = f"{DIGITALOCEAN_ENDPOINT_URL}/"


# Aumentar límite de tamaño de archivos subidos
DATA_UPLOAD_MAX_MEMORY_SIZE = 524288000  # 500MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 524288000  # 500MB
