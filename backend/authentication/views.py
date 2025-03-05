from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
# from django.contrib.auth.models import User
from rest_framework import status
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated




class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        selected_role = request.data.get("role")

        user = authenticate(username=username, password=password)

        if user is not None:
            print(f"User authenticated: {user.username}, Role in DB: {user.role}, Selected Role: {selected_role}")

            # Allow Superuser login when selecting Admin
            if selected_role == "admin" and user.is_superuser:
                user_role = "admin"
            else:
                user_role = user.role

            # Ensure role matches
            if user_role != selected_role:
                return Response({"error": "Invalid role selection. Please choose the correct role."}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            refresh["role"] = user_role  # Include role in token payload

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user_role  # Explicitly return role in response
            })

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        users = CustomUser.objects.filter(role__in=["technician", "operator"]).values("id", "username", "role")
        return Response(users, status=status.HTTP_200_OK)

class AddUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        if not username or not password or role not in ["technician", "operator"]:
            return Response({"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST)

        new_user = CustomUser.objects.create(username=username, role=role)
        new_user.set_password(password)
        new_user.save()

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)