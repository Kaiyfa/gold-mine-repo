# backend/backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from .views import MachineListCreateView, MachineDetailView, PerformanceView, DashboardSummaryView

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

    # Machine Endpoints
    path("api/machines/", MachineListCreateView.as_view(), name="machine-list-create"),
    path("api/machines/<int:pk>/", MachineDetailView.as_view(), name="machine-detail"),

    # Dashboard Summary Endpoint
    path("api/dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),

    # Performance Endpoint
    path("api/performance/", PerformanceView.as_view(), name="performance-api"),
]
