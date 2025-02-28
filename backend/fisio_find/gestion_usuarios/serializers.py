from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from gestion_usuarios.models import AppUser, Patient

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['username', 'email', 'password', 'name', 'surname', 'dni', 'phone_number', 'postal_code', 'photo']


