from django.db import models

class StatusChoices(models.TextChoices):
        PENDING = 'pendiente', 'Pendiente'
        ACCEPTED = 'aceptada', 'Aceptada'
        CANCELED = 'cancelada', 'Cancelada'

class Citas(models.Model):
    id = models.AutoField(primary_key=True) 
    date = models.DateField(verbose_name="Fecha")
    time = models.TimeField(verbose_name="hora")
    patient_id = models.IntegerField(verbose_name="Id_Paciente") # patient = models.ForeignKey('Patient', on_delete=models.CASCADE, verbose_name="Id_Paciente")
    physiotherapist_id = models.IntegerField(verbose_name="Id_fisio") # physiotherapist = models.ForeignKey('Physiotherapist', on_delete=models.CASCADE, verbose_name="Id_fisio")
    reason = models.CharField(max_length=200, verbose_name="motivo")
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING,
        verbose_name="estado"
    )

    class Meta:
        verbose_name = "Citas"
        verbose_name_plural = "Citas"

    def __str__(self):
        return f"Reserva {self.id} - {self.date} {self.time}"