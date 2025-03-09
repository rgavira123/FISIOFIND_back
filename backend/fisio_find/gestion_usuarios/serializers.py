from rest_framework import serializers
from rest_framework.validators import UniqueValidator  # Importación correcta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from .models import AppUser, Patient
from django.core.validators import RegexValidator
import re
from datetime import *  # Importar para obtener la fecha de hoy

from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import AppUser, Patient
from datetime import datetime
from django.core.validators import RegexValidator

class AppUserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(
        validators=[RegexValidator(regex=r'^\d{9}$', message="El número de teléfono debe tener exactamente 9 dígitos.")]
    )

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'email', 'phone_number', 'postal_code', 'dni', 'photo', 'account_status']
        extra_kwargs = {
            'username': {'validators': []},  # Evita la validación de unicidad automática en updates
            'dni': {'validators': []},  # Evita la validación de unicidad automática en updates
        }

    def validate_username(self, value):
        """Verifica si el nombre de usuario ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user  
        if AppUser.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El nombre de usuario ya está en uso.")
        return value

    def validate_email(self, value):
        """Verifica si el email ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user 
        if AppUser.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El email ya está en uso.")
        return value

    def validate_phone_number(self, value):
        """Verifica si el teléfono ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user
        if AppUser.objects.filter(phone_number=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El número de teléfono ya está en uso.")
        return value

    def validate_postal_code(self, value):
        """Verifica que el código postal tenga 5 dígitos"""
        if len(value) != 5:
            raise serializers.ValidationError("El código postal debe tener 5 dígitos.")
        return value

    def validate_dni(self, value):
        """Verifica si el DNI ya está en uso, excluyendo al propio usuario"""
        user = self.context.get('request').user 
        if AppUser.objects.filter(dni=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("El DNI ya está en uso.")
        return value

    def validate_image(image):
        if not image.name.endswith(('.jpg', '.jpeg', '.png')):
            raise ValidationError("La foto debe ser una imagen JPG, JPEG o PNG.")


class PatientSerializer(serializers.ModelSerializer):
    user = AppUserSerializer()

    class Meta:
        model = Patient
        fields = ['user', 'gender', 'birth_date']

    def validate_gender(self, value):
        """Verifica que el género no esté vacío"""
        if not value:
            raise serializers.ValidationError("El género es obligatorio.")
        return value

    def validate_birth_date(self, value):
        """Verifica que la fecha de nacimiento sea anterior a la fecha actual"""
        if value >= datetime.now().date():
            raise serializers.ValidationError("La fecha de nacimiento debe ser anterior a la fecha actual.")
        return value

    def validate(self, data):
        """Valida campos necesarios en el paciente"""
        user_data = data.get('user', {})

        if not user_data.get('username'):
            raise serializers.ValidationError({"username": "El nombre de usuario es obligatorio."})
        if not user_data.get('email'):
            raise serializers.ValidationError({"email": "El email es obligatorio."})
        if not user_data.get('phone_number'):
            raise serializers.ValidationError({"phone_number": "El teléfono es obligatorio."})
        if not user_data.get('dni'):
            raise serializers.ValidationError({"dni": "El DNI es obligatorio."})
        if not data.get('gender'):
            raise serializers.ValidationError({"gender": "El género es obligatorio."})
        if not data.get('birth_date'):
            raise serializers.ValidationError({"birth_date": "La fecha de nacimiento es obligatoria."})

        return data

    def update(self, instance, validated_data):
        """Actualiza tanto el paciente como su usuario"""
        user_data = validated_data.pop('user', None)
        user_instance = instance.user

        # Si hay datos de usuario, actualizar manualmente solo los campos proporcionados
        if user_data:
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        # Ahora actualizar el paciente
        return super().update(instance, validated_data)

class PatientRegisterSerializer(serializers.ModelSerializer):
    # Validación para campos únicos con `UniqueValidator`
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=AppUser.objects.all(), message="El nombre de usuario ya está en uso.")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=AppUser.objects.all(), message="El email ya está registrado.")]
    )
    dni = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=AppUser.objects.all(), message="El DNI ya está registrado.")]
    )

    password = serializers.CharField(write_only=True, required=True)
    phone_number = serializers.CharField(required=True)
    postal_code = serializers.CharField(required=True)
    first_name = serializers.CharField(
        required=True, 
        error_messages={'required': 'El campo nombre es obligatorio.'}
    )
    last_name = serializers.CharField(
        required=True, 
        error_messages={'required': 'El campo apellido es obligatorio.'}
    )
    birth_date = serializers.DateField(required=True)

    class Meta:
        model = Patient
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'dni', 'phone_number', 'postal_code', 'gender', 'birth_date'
        ]
        
    def validate_password(self, value):
        username = self.initial_data.get("username", "")
        user = AppUser(username=username)  
        validate_password(value, user=user)  
        return value
    
    def validate(self, data):
        """Validaciones adicionales para DNI, teléfono y código postal."""
        dni_pattern = re.compile(r'^\d{8}[A-HJ-NP-TV-Z]$')
        if not dni_pattern.match(data['dni']):
            raise serializers.ValidationError({"dni": "El DNI debe tener 8 números seguidos de una letra válida."})
        
        if len(data['phone_number']) != 9:
            raise serializers.ValidationError({"phone_number": "El número de teléfono debe tener 9 caracteres."})
        
        if len(data['postal_code']) != 5:
            raise serializers.ValidationError({"postal_code": "El código postal debe tener 5 caracteres."})

        if not data['first_name']:
            raise serializers.ValidationError({"first_name": "El campo nombre es obligatorio."})
        
        if not data['last_name']:
            raise serializers.ValidationError({"last_name": "El campo apellido es obligatorio."})
        
        today = date.today()
        if data['birth_date'] > today:
            raise serializers.ValidationError({"birth_date": "La fecha de nacimiento no puede ser posterior a la fecha actual."})

        return data

    def create(self, validated_data):
        """Manejo de `IntegrityError` al crear el usuario."""
        try:
            user = AppUser.objects.create(
                username=validated_data.pop('username'),
                email=validated_data.pop('email'),
                first_name=validated_data.pop('first_name'),
                last_name=validated_data.pop('last_name'),
                dni=validated_data.pop('dni'),
                phone_number=validated_data.pop('phone_number'),
                postal_code=validated_data.pop('postal_code'),
                password=make_password(validated_data.pop('password'))  # Encripta la contraseña
            )
            
            gender = validated_data.pop('gender')
            birth_date = validated_data.pop('birth_date')

            # Crear el paciente y asociarlo al usuario
            patient = Patient.objects.create(user=user, gender=gender, birth_date=birth_date)
            return patient

        except IntegrityError as e:
            raise serializers.ValidationError({"error": "Error de integridad en la base de datos. Posible duplicado de datos."})

