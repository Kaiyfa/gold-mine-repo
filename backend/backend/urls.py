# backend/backend/urls.py
from django.http import JsonResponse
from django.views.generic import TemplateView
from .views import (
    MachineListCreateView, MachineDetailView, PerformanceView,
    DashboardSummaryView, update_machine_status, submit_maintenance_report, start_machine_operation
)
from backend.views import get_machines
from django.urls import path, include, re_path
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
import os

# Home endpoint (optional)
def home(request):
    return JsonResponse({"message": "Welcome to the Gold Mine Management API"})

urlpatterns = [
    # Admin panel
    path("admin/", admin.site.urls),

    # Authentication endpoints (e.g., login, logout, token refresh)
    path("api/auth/", include("authentication.urls")),

    # Home endpoint
    path("", home),
    path("api/machines/", get_machines, name="get-machines"), 

    path("api/machines/start-operation/", start_machine_operation, name="start-machine-operation"),

    # Machine Endpoints
    path("api/machines/", MachineListCreateView.as_view(), name="machine-list-create"),
    path("api/machines/<int:pk>/", MachineDetailView.as_view(), name="machine-detail"),

    # Dashboard Summary
    path("api/dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),

    # Performance Endpoint (CONFIRMED: Should exist in backend/views.py)
    path("api/performance/", PerformanceView.as_view(), name="performance-api"),

    # Machine Status Update (Technician functionality)
    path("api/machines/update-status/<int:machine_id>/", update_machine_status, name="update-machine-status"),

    # Maintenance Report Submission (Technician functionality)
    path("api/maintenance/report/", submit_maintenance_report, name="submit-maintenance-report"),

    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),  # Ensure your API routes work
    path("auth/", include("authentication.urls")),  # ✅ Authentication
]


if os.path.exists(os.path.join(settings.STATICFILES_DIRS[0], "index.html")):
    urlpatterns += [
        re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
    ]

# ✅ Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
