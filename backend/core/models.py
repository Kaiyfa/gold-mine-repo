from django.db import models
from django.conf import settings  # Import settings to use AUTH_USER_MODEL


# Create your models here.
class Machine(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("In Maintenance", "In Maintenance"),
    ])
    manufacturer = models.CharField(max_length=100)
    model_number = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    purchase_date = models.DateField()

    class Meta:
        db_table = "core_machine"  

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
    MaintenanceDate = models.DateField()
    IssueReported = models.CharField(max_length=255, null=True, blank=True)
    MaintenanceCost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField(default="No description provided")  

    def __str__(self):
        return f"{self.Machine.ModelNumber} - {self.MaintenanceDate}"



