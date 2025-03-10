# backend/backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from .views import (
    MachineListCreateView, MachineDetailView, PerformanceView,
    DashboardSummaryView, update_machine_status, submit_maintenance_report, start_machine_operation
)
from backend.views import get_machines

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
]
