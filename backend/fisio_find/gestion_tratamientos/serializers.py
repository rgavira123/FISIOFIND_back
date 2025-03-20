from rest_framework import serializers
from .models import Exercise, ExerciseLog, ExerciseSession, Session, Treatment
from gestion_usuarios.serializers import PhysioSerializer
from gestion_usuarios.serializers import PatientSerializer
from django.utils import timezone

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = ['id', 'physiotherapist', 'patient', 'start_time', 'end_time', 
                 'homework', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Validar fechas solo si están presentes en los datos
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
                )
        
        elif 'start_time' in data and 'end_time' not in data and self.instance:
            # Si solo está actualizando start_time
            if data['start_time'] >= self.instance.end_time:
                raise serializers.ValidationError(
                    {"start_time": "La fecha de inicio debe ser anterior a la fecha de finalización."}
                )
        
        elif 'end_time' in data and 'start_time' not in data and self.instance:
            # Si solo está actualizando end_time
            if self.instance.start_time >= data['end_time']:
                raise serializers.ValidationError(
                    {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
                )
        
        # Validar que la fecha de inicio no sea anterior a la fecha actual
        if 'start_time' in data:
            current_time = timezone.now()
            if data['start_time'] < current_time:
                raise serializers.ValidationError(
                    {"start_time": "La fecha de inicio no puede ser anterior a la fecha actual."}
                )
        
        return data
        
class TreatmentDetailSerializer(serializers.ModelSerializer):
    physiotherapist = PhysioSerializer(read_only=True)
    patient = PatientSerializer(read_only=True)
    
    class Meta:
        model = Treatment
        fields = ['id', 'physiotherapist', 'patient', 'start_time', 'end_time', 
                 'homework', 'is_active', 'created_at', 'updated_at', 'sessions']
        read_only_fields = ['id', 'created_at', 'updated_at']
        
class ExerciseSerializer(serializers.ModelSerializer):
    """
    Serializador para la creación y visualización de ejercicios.
    """
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'description', 'area', 'material_required']
        read_only_fields = ['id']
        
class ExerciseSessionSerializer(serializers.ModelSerializer):
    """
    Serializador para la creación y visualización de ejercicios asignados a una sesión.
    """
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())  # Se espera solo el ID
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())  # Se espera solo el ID

    class Meta:
        model = ExerciseSession
        fields = ['id', 'exercise', 'session', 'series', 'repetitions', 'weight', 'time']
        read_only_fields = ['id']
        
class SessionSerializer(serializers.ModelSerializer):
    """
    Serializador para la creación y visualización de sesiones.
    """
    class Meta:
        model = Session
        fields = ['id', 'treatment', 'day_of_week']
        read_only_fields = ['id']
        
class ExerciseLogSerializer(serializers.ModelSerializer):
    """
    Serializador para la creación y visualización de registros de ejercicios.
    """
    exercise_session = ExerciseSessionSerializer(read_only=True)

    class Meta:
        model = ExerciseLog
        fields = ['id', 'exercise_session', 'date', 'repetitions_done', 'weight_done', 'time_done', 'notes', 'patient']
        read_only_fields = ['id', 'date', 'patient']