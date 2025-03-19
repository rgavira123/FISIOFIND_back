from rest_framework import serializers
from .models import Treatment
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
                 'homework', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']