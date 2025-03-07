from django.urls import path
from .views import (
    LoginView, LogoutView, RefreshTokenView, AddUserView, DashboardSummaryView, PerformanceView
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh-token/", RefreshTokenView.as_view(), name="refresh-token"),
    path("add-user/", AddUserView.as_view(), name="add-user"),
]
