from rest_framework import serializers
from gestion_citas.models import Citas

class CitasSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    date = serializers.DateField()
    time = serializers.TimeField()
    patient_id = serializers.IntegerField() # patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    physiotherapist_id = serializers.IntegerField() # physiotherapist = serializers.PrimaryKeyRelatedField(queryset=Physiotherapist.objects.all())
    reason = serializers.CharField(max_length=200, allow_blank=True, required=False)
    status = serializers.ChoiceField(
        choices=[
            ('pendiente', 'Pendiente'),
            ('rechazada', 'Rechazada'),
            ('modificada', 'Modificada'),
            ('acabada', 'Acabada'),
            ('aceptada', 'Aceptada'),
            ('cancelada', 'Cancelada'),
        ],
        default='pendiente'
    )

    def create(self, validated_data):
        """
        Create and return a new `Citas` instance, given the validated data.
        """
        return Citas.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Citas` instance, given the validated data.
        """
        instance.date = validated_data.get('date', instance.date)
        instance.time = validated_data.get('time', instance.time)
        instance.patient_id = validated_data.get('patient_id', instance.patient_id)
        instance.physiotherapist_id = validated_data.get('physiotherapist_id', instance.physiotherapist_id)
        instance.reason = validated_data.get('reason', instance.reason)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance