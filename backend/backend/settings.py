"""
Django settings for backend project.
"""

import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory (Ensure this path is correct)
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret Key (Keep it secret!)
SECRET_KEY = os.getenv("SECRET_KEY", "your-django-secret-key")

# Debug mode (Set to False in production)
DEBUG = os.getenv("DEBUG", "True") == "True"

# Allowed Hosts (Change this if necessary)
ALLOWED_HOSTS = ["localhost", "127.0.0.1", os.getenv("RENDER_EXTERNAL_HOSTNAME", "your-app-name.onrender.com")]

# Installed Apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "authentication",
    "rest_framework_simplejwt",
    "corsheaders",
    "core",
]

# Middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# CORS settings (Frontend connection)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

# Root URL Configuration
ROOT_URLCONF = "backend.urls"

# Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "static/build")],  # <-- Ensure React build is included here
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI Application
WSGI_APPLICATION = "backend.wsgi.application"

# Database (PostgreSQL)
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True  
    )
}

# Authentication
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
]

AUTH_USER_MODEL = "authentication.CustomUser"

# Static & Media Files
STATIC_URL = "/static/" 

# Tell Django where the React build is located
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static/build")]


# Where static files are collected when you run `collectstatic`
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Media files
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")# TEMPLATES[0]["DIRS"] = [os.path.join(BASE_DIR, "backend/static/build")]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
