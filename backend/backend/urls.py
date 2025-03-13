# backend/urls.py
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

# Home endpoint
# def home(request):
#     return JsonResponse({"message": "Welcome to the Gold Mine Management API"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("api/", include("core.urls")),  

    # Serve React Frontend at root
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)