from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from datetime import datetime
# Ensure timezone compatibility
import pytz 
from core.models import Machine, Maintenance
from authentication.models import CustomUser, Performance
from django.db.models import Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Avg
import logging
from .serializers import MachineSerializer  
from .serializers import PerformanceSerializer  



# Machine List and Create View
logger = logging.getLogger(__name__)


class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

class MachineListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Handle GET request
        pass

    def post(self, request):
        # Handle POST request
        pass

# Machine Detail, Update, and Delete View
class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

# Performance Data API

class PerformanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            performance_data = Performance.objects.all()
            serializer = PerformanceSerializer(performance_data, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# Dashboard Summary API
class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            machines_count = Machine.objects.count()
            operators_count = CustomUser.objects.filter(role="operator").count()
            technicians_count = CustomUser.objects.filter(role="technician").count()
            
            return Response({
                "machines": machines_count,
                "operators": operators_count,
                "technicians": technicians_count
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Update Machine Status
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_machine_status(request, machine_id):
    """
    Updates machine status, tracks maintenance history, and automatically updates performance.
    """
    machine = get_object_or_404(Machine, id=machine_id)
    new_status = request.data.get("status")
    maintenance_time = request.data.get("maintenance_time")  # Expecting ISO format YYYY-MM-DD HH:MM:SS

    VALID_STATUSES = ["Available", "Scheduled for Maintenance", "Under Maintenance"]

    # Check if the new status is valid
    if new_status not in VALID_STATUSES:
        return Response({"error": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Ensure valid maintenance time format and make it timezone-aware
    try:
        if maintenance_time:
            maintenance_time = datetime.strptime(maintenance_time, "%Y-%m-%d %H:%M:%S")
            maintenance_time = pytz.utc.localize(maintenance_time)  # Convert to UTC
        else:
            maintenance_time = now()
    except ValueError:
        return Response({"error": "Invalid datetime format. Use YYYY-MM-DD HH:MM:SS."}, status=status.HTTP_400_BAD_REQUEST)

    # Ensure performance record exists
    performance, created = Performance.objects.get_or_create(machine=machine)

    #  If setting machine to "Scheduled for Maintenance"
    if new_status == "Scheduled for Maintenance":
        machine.status = new_status  # Just update status, no time tracking

    #  If setting machine to "Under Maintenance"
    elif new_status == "Under Maintenance":
        machine.maintenance_start_time = maintenance_time  # ✅ Save start time
        machine.status = new_status

        Maintenance.objects.create(
            Machine=machine,
            MaintenanceStart=maintenance_time,
            MaintenanceDate=maintenance_time.date(),  # ✅ Ensure MaintenanceDate is filled
            IssueReported="Scheduled Maintenance"
        )

        # 🔹 **Increase Downtime**
        performance.downtime += 1

    #  If setting machine to "Available"
    elif new_status == "Available":
        if not machine.maintenance_start_time:
            #  Instead of blocking, we now create a maintenance history entry
            machine.maintenance_start_time = now()
            machine.maintenance_end_time = maintenance_time

            Maintenance.objects.create(
                Machine=machine,
                MaintenanceStart=machine.maintenance_start_time,
                MaintenanceEnd=maintenance_time,
                MaintenanceDate=machine.maintenance_start_time.date(),  # ✅ Ensure MaintenanceDate is filled
                IssueReported="No prior maintenance, auto-recorded."
            )
        else:
            # Normal flow: update end time
            machine.maintenance_end_time = maintenance_time
            maintenance_record = Maintenance.objects.filter(Machine=machine, MaintenanceEnd__isnull=True).last()
            if maintenance_record:
                maintenance_record.MaintenanceEnd = maintenance_time
                maintenance_record.save()

        machine.status = new_status

        # 🔹 **Increase Uptime**
        performance.uptime += 1

    # 🔹 **Auto-calculate efficiency**
    performance.update_efficiency()
    performance.save()

    machine.save()

    return Response({
        "message": f"Machine {machine.id} status updated to {machine.status}.",
        "performance": {
            "uptime": performance.uptime,
            "downtime": performance.downtime,
            "efficiency": f"{performance.efficiency:.2f}%"
        }
    }, status=status.HTTP_200_OK)


# Submit Maintenance Report
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_maintenance_report(request):
    technician = request.user
    machine_id = request.data.get("machine_id")
    issue_reported = request.data.get("issue_reported")
    maintenance_start = request.data.get("maintenance_start")
    maintenance_end = request.data.get("maintenance_end")
    maintenance_cost = request.data.get("maintenance_cost", 0.0)

    if technician.role != "technician":
        return Response({"error": "Only technicians can submit maintenance reports."}, status=status.HTTP_403_FORBIDDEN)
    
    machine = get_object_or_404(Machine, id=machine_id)
    
    try:
        maintenance_start = datetime.fromisoformat(maintenance_start) if maintenance_start else now()
        maintenance_end = datetime.fromisoformat(maintenance_end) if maintenance_end else None
    except ValueError:
        return Response({"error": "Invalid datetime format. Use ISO format (YYYY-MM-DD HH:MM:SS)."}, status=status.HTTP_400_BAD_REQUEST)

    maintenance = Maintenance.objects.create(
        Machine=machine,
        MaintenanceDate=now(),
        IssueReported=issue_reported,
        MaintenanceCost=maintenance_cost,
        MaintenanceStart=maintenance_start,
        MaintenanceEnd=maintenance_end,
    )

    return Response({
        "message": "Maintenance report submitted successfully!",
        "data": {
            "machine": machine.id,
            "issue": issue_reported,
            "start_time": maintenance_start,
            "end_time": maintenance_end,
            "cost": maintenance_cost
        }
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_machines(request):
    try:
        machines = Machine.objects.all()
        serializer = MachineSerializer(machines, many=True)
        return Response(serializer.data)  
    except Exception as e:
        return Response({"error": str(e)}, status=500)  
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_machine_operation(request):
    """
    Track uptime when an operator starts using a machine.
    """
    machine_id = request.data.get("machine_id")
    operator_username = request.data.get("operator_username")

    machine = Machine.objects.get(id=machine_id)
    performance, created = Performance.objects.get_or_create(machine=machine)

    # Increment uptime
    performance.uptime += 1  # This represents one hour of operation (you can change this logic)
    performance.update_efficiency()

    return Response({"message": f"Machine {machine.id} is now being used by {operator_username}."})
