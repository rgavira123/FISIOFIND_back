from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import AppUser, Patient

class PatientRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    birth_date = serializers.DateField()

    class Meta:
        model = Patient
        fields = ['username', 'email', 'password', 'gender', 'birth_date']

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        raw_password = validated_data.pop('password')
        birth_date = validated_data.pop('birth_date')
        gender = validated_data.pop('gender')
        
        user = AppUser.objects.create(
            username=username,
            email=email,
            password=make_password(raw_password)
        )
        
        patient = Patient.objects.create(
            user=user,
            birth_date=birth_date,
            gender=gender
        )
        return patient
