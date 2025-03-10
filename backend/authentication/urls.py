from django.urls import path
from backend.views import update_machine_status, submit_maintenance_report 
from .views import refresh_access_token
from .views import LoginView, LogoutView, AddUserView, refresh_access_token
from rest_framework_simplejwt.tokens import RefreshToken


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh-token/", refresh_access_token, name="refresh-token"),  
    path("add-user/", AddUserView.as_view(), name="add-user"),
    path("machines/update-status/<int:machine_id>/", update_machine_status, name="update-machine-status"),
    path("maintenance/report/", submit_maintenance_report, name="submit-maintenance-report"),
]
