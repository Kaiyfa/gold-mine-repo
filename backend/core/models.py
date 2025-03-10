from django.db import models
from django.conf import settings  
from django.utils.timezone import now
from django.core.exceptions import ValidationError

# Create your models here.

class Machine(models.Model):
    STATUS_CHOICES = [
        ("Available", "Available"),
        ("In Use", "In Use"),
        ("Under Maintenance", "Under Maintenance"),
    ]
    name = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=100)
    model_number = models.CharField(max_length=100)
    purchase_date = models.DateField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Available")
    last_maintenance_date = models.DateTimeField(null=True, blank=True)
    downtime_hours = models.FloatField(default=0)

    def update_downtime(self):
        """Update downtime if machine was under maintenance."""
        if self.status == "Available" and self.last_maintenance_date:
            duration = (now() - self.last_maintenance_date).total_seconds() / 3600
            self.downtime_hours += duration
            self.save()

    def clean(self):
        """Validation to prevent negative downtime hours."""
        if self.downtime_hours < 0:
            raise ValidationError("Downtime hours cannot be negative.")

    def __str__(self):
        return self.name

class Technician(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
    
class Maintenance(models.Model):
    MaintenanceID = models.AutoField(primary_key=True)
    Machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    MaintenanceDate = models.DateField(auto_now_add=True)  
    MaintenanceStart = models.DateTimeField(null=True, blank=True)
    MaintenanceEnd = models.DateTimeField(null=True, blank=True)
    IssueReported = models.CharField(max_length=255, null=True, blank=True)
    MaintenanceCost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField(default="No description provided")

    def __str__(self):
        return f"{self.Machine.ModelNumber} - {self.MaintenanceDate}"
