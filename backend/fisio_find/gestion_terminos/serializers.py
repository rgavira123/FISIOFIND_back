from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from gestion_terminos.models import AppTerminos

class AppTerminosSerializer(serializers.ModelSerializer):

    class Meta:
        model = AppTerminos
        fields = '__all__'