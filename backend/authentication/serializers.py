from .models import Operator
from django.apps import apps
Performance = apps.get_model("authentication", "Performance")


# backend/authentication/serializers.py
from rest_framework import serializers
from django.conf import settings  
from .models import Profile,  Manufacturer 
from core.models import Machine, Technician 

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = settings.AUTH_USER_MODEL 
        fields = ["username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ["user", "role", "id_number"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        User = settings.AUTH_USER_MODEL  
        user = User.objects.create_user(**user_data)
        profile = Profile.objects.create(user=user, **validated_data)
        return profile

# Machine Serializer

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = "__all__"

# Performance Serializer
class PerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = "__all__"

# Technician Serializer
class TechnicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technician
        fields = "__all__"


# Manufacturer Serializer (if needed)
class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = "__all__"


class OperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operator
        fields = '__all__'