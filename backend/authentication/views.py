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
from django.contrib.auth.models import User
from django.views import View
from core.models import Machine, Technician 
from .models import Operator, CustomUser, Performance
from .serializers import MachineSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_machines(request):
    machines = Machine.objects.all()
    serializer = MachineSerializer(machines, many=True)
    return Response(serializer.data)


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

# CRUD for Machines
class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

# Dashboard Summary View 
class DashboardSummaryView(APIView):
    def get(self, request):
        try:
            machines_count = Machine.objects.count()
            operators_count = Operator.objects.count()
            technicians_count = Technician.objects.count()

            return Response({
                "machines": machines_count,
                "operators": operators_count,
                "technicians": technicians_count
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# Performance View
class PerformanceView(APIView):
    def get(self, request):
        performance_data = Performance.objects.values("machine_id", "performance")
        return Response(list(performance_data))

#Logout View
class LogoutView(APIView):
    def post(self, request):
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

# Token Refresh View
class RefreshTokenView(TokenRefreshView):
    pass

# Add User View
class AddUserView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")
        id_number = request.data.get("id_number")

        if not username or not password or not role or not id_number:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        new_user = CustomUser.objects.create(
            username=username,
            password=make_password(password),
            role=role,
        )

        return Response({"message": f"User {username} created successfully!"}, status=status.HTTP_201_CREATED)
