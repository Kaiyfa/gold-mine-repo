from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('technician', 'Technician'),
        ('operator', 'Operator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')

    def save(self, *args, **kwargs):
        if self.is_superuser:  # Ensure superusers are always admins
            self.role = 'admin'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"