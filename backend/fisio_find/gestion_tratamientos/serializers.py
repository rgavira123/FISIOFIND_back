from rest_framework import serializers 
from .models import Exercise, ExerciseLog, ExerciseSession, Session, Treatment, Series
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
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError(
                    {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
                )
        elif 'start_time' in data and 'end_time' not in data and self.instance:
            if data['start_time'] >= self.instance.end_time:
                raise serializers.ValidationError(
                    {"start_time": "La fecha de inicio debe ser anterior a la fecha de finalización."}
                )
        elif 'end_time' in data and 'start_time' not in data and self.instance:
            if self.instance.start_time >= data['end_time']:
                raise serializers.ValidationError(
                    {"end_time": "La fecha de finalización debe ser posterior a la fecha de inicio."}
                )
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
    physiotherapist = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'description', 'area', 'physiotherapist']
        read_only_fields = ['id']
        
class ExerciseSessionSerializer(serializers.ModelSerializer):
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())
    
    class Meta:
        model = ExerciseSession
        fields = ['id', 'exercise', 'session']
        read_only_fields = ['id']

class SeriesSerializer(serializers.ModelSerializer):
    exercise_session = serializers.PrimaryKeyRelatedField(queryset=ExerciseSession.objects.all())
    
    class Meta:
        model = Series
        fields = ['id', 'exercise_session', 'series_number', 'repetitions', 'weight', 'time', 'distance']
        read_only_fields = ['id']
    
    def validate(self, data):
        if data.get('repetitions', 0) <= 0:
            raise serializers.ValidationError("El número de repeticiones debe ser mayor a cero.")
        if not any([data.get('weight'), data.get('time'), data.get('distance')]):
            raise serializers.ValidationError("Debe haber al menos una métrica (peso, tiempo o distancia).")
        return data

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'treatment', 'day_of_week']
        read_only_fields = ['id']
        
class ExerciseLogSerializer(serializers.ModelSerializer):
    series = SeriesSerializer(read_only=True)

    class Meta:
        model = ExerciseLog
        fields = ['id', 'series', 'date', 'repetitions_done', 'weight_done', 'time_done', 'distance_done', 'notes', 'patient']
        read_only_fields = ['id', 'date', 'patient']
