"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

application = get_wsgi_application()


if __name__ == "__main__":
    from django.core.management import execute_from_command_line
    os.environ.setdefault("PORT", "8000")
    execute_from_command_line(["manage.py", "runserver", "0.0.0.0:8000"])
