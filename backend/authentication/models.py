from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings  
from core.models import Machine 

class Operator(models.Model):
    # Auto-incrementing primary key
    OperatorID = models.AutoField(primary_key=True)  
     # varchar(100)
    Name = models.CharField(max_length=100) 
    # varchar(150), allows NULL
    ContactDetails = models.CharField(max_length=150, null=True, blank=True)  
    Role = models.CharField(
        max_length=50,
        choices=[
            ('Technician', 'Technician'),
            ('Supervisor', 'Supervisor'),
            ('Manager', 'Manager')
        ]
    ) 

    def __str__(self):
        return self.Name


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    role = models.CharField(max_length=20, choices=[
        ("technician", "Technician"),
        ("operator", "Operator"),
        ("admin", "Admin"),
    ])
    id_number = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Manufacturer(models.Model):
     # Auto-incrementing primary key
    ManufacturerID = models.AutoField(primary_key=True) 
    Name = models.CharField(max_length=100)  
    Country = models.CharField(max_length=50, null=True, blank=True)  
    ContactDetails = models.CharField(max_length=150, null=True, blank=True)  
    YearEstablished = models.IntegerField(null=True, blank=True) 
    CertificationLevel = models.CharField(
        max_length=50,
        choices=[
            ('ISO 9001', 'ISO 9001'),
            ('ISO 14001', 'ISO 14001'),
            ('Other', 'Other')
        ],
        default='Other'
    )  

    def __str__(self):
        return self.Name
    

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('technician', 'Technician'),
        ('operator', 'Operator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

    def save(self, *args, **kwargs):
        if self.is_superuser:  
            self.role = 'admin'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"
    

class Performance(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE) 
    performance = models.FloatField()

    def __str__(self):
        return f"Performance of {self.machine.name}"
