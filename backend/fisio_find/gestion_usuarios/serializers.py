from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import AppUser, Patient

class PatientRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    age = serializers.IntegerField()

    class Meta:
        model = Patient
        fields = ['username', 'email', 'password', 'gender', 'age']

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        raw_password = validated_data.pop('password')
        
        user = AppUser.objects.create(
            username=username,
            email=email,
            password=make_password(raw_password)
        )
        
        patient = Patient.objects.create(user=user, **validated_data)
        return patient
