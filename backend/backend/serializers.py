# backend/backend/serializers.py
from rest_framework import serializers
from core .models import Machine
from authentication.models import Performance

# Machine Serializer
class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = "__all__"
# ✅ Performance Serializer
class PerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = "__all__"
