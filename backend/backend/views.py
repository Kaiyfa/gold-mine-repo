# backend/backend/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from core.models import Machine
from authentication.models import Performance  # Ensure correct import
from authentication.serializers import MachineSerializer, PerformanceSerializer

# Machine List and Create View (Read & Create)
class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

# Machine Detail, Update, and Delete View (Retrieve, Update, Delete)
class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

# Performance Data API
class PerformanceView(APIView):
    def get(self, request):
        performance_data = Performance.objects.values("machine_id", "performance")
        return Response(list(performance_data))

# Dashboard Summary API
class DashboardSummaryView(APIView):
    def get(self, request):
        machines_count = Machine.objects.count()
        return Response({"machines": machines_count})
