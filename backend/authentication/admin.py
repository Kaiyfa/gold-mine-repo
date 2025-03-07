
# Register your models here.
from django.contrib import admin
from .models import Manufacturer, Operator
from core.models import Machine, Maintenance

admin.site.register(Machine)
admin.site.register(Manufacturer)
admin.site.register(Maintenance)
admin.site.register(Operator)
