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
    
class Session(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, related_name='sessions')
    day_of_week = models.IntegerField(choices=[(i, day) for i, day in enumerate(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"])])
    
    def __str__(self):
        return f"Session for {self.treatment.patient.user.username} by {self.treatment.physiotherapist.user.username} on {self.get_day_of_week_display()}"
    
class Exercise(models.Model):
    AREA_CHOICES = [
    ("UPPER_BODY", "Parte Superior del Cuerpo"),
    ("LOWER_BODY", "Parte Inferior del Cuerpo"),
    ("CORE", "Zona Media/Core"),
    ("FULL_BODY", "Cuerpo Completo"),
    
    # Opciones detalladas de grupos musculares
    ("SHOULDER", "Hombros"),
    ("ARM", "Brazos (Bíceps, Tríceps)"),
    ("CHEST", "Pecho"),
    ("BACK", "Espalda"),
    
    ("QUADRICEPS", "Cuádriceps"),
    ("HAMSTRINGS", "Isquiotibiales"),
    ("GLUTES", "Glúteos"),
    ("CALVES", "Pantorrillas"),
    
    ("NECK", "Cuello"),
    ("LOWER_BACK", "Zona Lumbar"),
    ("HIP", "Caderas"),
    
    ("BALANCE", "Ejercicios de Equilibrio"),
    ("MOBILITY", "Movilidad"),
    ("STRETCHING", "Estiramientos"),
    ("PROPRIOCEPTION", "Propiocepción"),
]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    area = models.CharField(max_length=255, choices=AREA_CHOICES)
    material_required = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
    
class ExerciseSession(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_sessions')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='exercise_sessions')
    
    SERIES_TYPE_CHOICES = [
        ("REPS_WEIGHT", "Repeticiones y Carga"),
        ("REPS_TIME", "Repeticiones y Tiempo"),
    ]
    
    series_type = models.CharField(max_length=20, choices=SERIES_TYPE_CHOICES)
    
    series = models.IntegerField()
    repetitions = models.IntegerField()
    weight = models.FloatField(blank=True, null=True)
    time = models.DurationField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.exercise.title} ({self.series}x{self.repetitions})"
    
class ExerciseLog(models.Model):
    exercise_session = models.ForeignKey(ExerciseSession, on_delete=models.CASCADE, related_name='exercise_logs')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='exercise_logs')
    date = models.DateField(auto_now_add=True)
    repetitions_done = models.IntegerField(null=True, blank=True)
    weight_done = models.FloatField(blank=True, null=True)
    time_done = models.DurationField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.exercise_session.exercise.title} ({self.repetitions_done}x{self.exercise_session.repetitions})"
    
