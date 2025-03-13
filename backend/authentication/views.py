from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, status
from django.http import JsonResponse
from core.models import Machine
from .models import CustomUser
from .serializers import MachineSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import logging

logger = logging.getLogger(__name__)


# Login View
class LoginView(TokenObtainPairView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        selected_role = request.data.get("role")

        user = authenticate(username=username, password=password)

        if user is not None:
            print(f"User authenticated: {user.username}, Role in DB: {user.role}, Selected Role: {selected_role}")

            if selected_role == "admin" and user.is_superuser:
                user_role = "admin"
            else:
                user_role = user.role

            if user_role != selected_role:
                return Response({"error": "Invalid role selection."}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            refresh["role"] = user_role

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user_role
            })

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
# class LoginView(TokenObtainPairView):
#     def post(self, request):
#         username = request.data.get("username")
#         password = request.data.get("password")
#         selected_role = request.data.get("role")

#         user = authenticate(username=username, password=password)

#         if user is not None:
#             print(f"User authenticated: {user.username}, Role in DB: {user.role}, Selected Role: {selected_role}")

#             if selected_role == "admin" and user.is_superuser:
#                 user_role = "admin"
#             else:
#                 user_role = user.role

#             if user_role != selected_role:
#                 return Response({"error": "Invalid role selection."}, status=status.HTTP_403_FORBIDDEN)

#             refresh = RefreshToken.for_user(user)
#             refresh["role"] = user_role

#             return Response({
#                 "refresh": str(refresh),
#                 "access": str(refresh.access_token),
#                 "role": user_role
#             })

#         return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    


# Add User View
class AddUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")
        id_number = request.data.get("id_number")

        if not username or not password or not role or not id_number:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_user = CustomUser.objects.create(
                username=username,
                password=make_password(password),
                role=role,
            )
            return Response({"message": f"User {username} created successfully!"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Logout View
class LogoutView(APIView):
    def post(self, request):
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)


# Token Refresh View

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def refresh_access_token(request):
    """
    Manually refresh access token using a valid refresh token.
    """
    try:
        refresh_token = request.data.get("refresh")  

        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken(refresh_token)  

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


