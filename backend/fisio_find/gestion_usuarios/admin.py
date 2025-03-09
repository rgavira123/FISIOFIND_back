from django.contrib import admin
from .models import AppUser, Patient, Physiotherapist

# Register your models here.

admin.site.register(AppUser)
admin.site.register(Patient)
admin.site.register(Physiotherapist)
