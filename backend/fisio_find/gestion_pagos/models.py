from django.db import models
from django.utils import timezone
from datetime import timedelta
from gestion_citas.models import Appointment


#HAY QUE PEDIR CAMBIO EN EL UML YA QUE SI QUIEREN LAS FACTURAS SE DEBERIAN DE GUARDAR EN UNA TABLA APARTE
class Payment(models.Model):
    PAYMENT_STATUSES = (
        ('Not Paid', 'Not Paid'),
        ('Paid', 'Paid'),
        ('Refunded', 'Refunded'),
    )
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='Card')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUSES, default='Not Paid')
    payment_date = models.DateTimeField(null=True, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=100, null=True, blank=True)

    @property
    def payment_deadline(self):
        return self.appointment.appointment_time - timedelta(hours=48)

    def __str__(self):
        return f"Payment for appointment {self.appointment.id} - {self.status}"