from django.urls import path
from .views import LoginView, LogoutView
from .views import LoginView, UserListView, AddUserView


urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('add-user/', AddUserView.as_view(), name="add-user"),
    path('users/', UserListView.as_view(), name="user-list"),

]
