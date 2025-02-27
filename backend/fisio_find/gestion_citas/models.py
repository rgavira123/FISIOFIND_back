from django.db import models

class StatusChoices(models.TextChoices):
    FINISHED = "finished", "Finished"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELED = "canceled", "Canceled"
    BOOKED = "booked", "Booked"

class Appointment(models.Model):
    id = models.AutoField(primary_key=True) 
    start_time = models.DateTimeField(verbose_name="start_time")
    end_time = models.DateTimeField(verbose_name="end_time")
    is_online = models.BooleanField(verbose_name="is_online")
    service = models.JSONField(verbose_name="service")
    patient_id = models.IntegerField(verbose_name="Id_Patient") # patient = models.ForeignKey('Patient', on_delete=models.CASCADE, verbose_name="Id_Patient")
    physiotherapist_id = models.IntegerField(verbose_name="Id_physiotherapist") # physiotherapist = models.ForeignKey('Physiotherapist', on_delete=models.CASCADE, verbose_name="Id_physiotherapist")
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.BOOKED,
        verbose_name="status"
    )

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointment"

    def __str__(self):
        return f"Reserva {self.id} - {self.start_time}"