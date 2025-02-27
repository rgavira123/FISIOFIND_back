from rest_framework import serializers
from gestion_citas.models import Appointment

class AppointmentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True) 
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    is_online = serializers.BooleanField()
    service = serializers.JSONField()
    patient_id = serializers.IntegerField() # patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    physiotherapist_id = serializers.IntegerField() # physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all())
    status = serializers.ChoiceField(
        choices=[
            ('finished', 'finished'),
            ('confirmed', 'confirmed'),
            ('canceled', 'canceled'),
            ('booked', 'booked'),
        ],
        default='booked'
    )

    def create(self, validated_data):
        """
        Create and return a new `Appointment` instance, given the validated data.
        """
        return Appointment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Appointment` instance, given the validated data.
        """
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.is_online = validated_data.get('is_online', instance.is_online)
        instance.service = validated_data.get('service', instance.service)
        instance.patient_id = validated_data.get('patient_id', instance.patient_id)
        instance.physiotherapist_id = validated_data.get('physiotherapist_id', instance.physiotherapist_id)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance