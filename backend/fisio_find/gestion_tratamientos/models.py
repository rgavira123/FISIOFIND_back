from django.db import models
from gestion_usuarios.models import Physiotherapist
from gestion_usuarios.models import Patient

class Treatment(models.Model):
    physiotherapist = models.ForeignKey(Physiotherapist, on_delete=models.CASCADE, related_name='treatments')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatments')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    homework = models.TextField(blank=True, null=True)  # Placeholder para "deberes"
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Treatment for {self.patient.user.username} by {self.physiotherapist.user.username}"