from django.db import models

class AppUser(models.Model):
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),

    ]

    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    photo = models.ImageField(blank=True, null=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=100)
    dni = models.CharField(max_length=9, unique=True)
    phone_number = models.CharField(max_length=9, unique=True)
    postal_code = models.CharField(max_length=10)


    def __str__(self):
        return self.email

class Patient(AppUser):  
    gender = models.CharField(max_length=1, choices=AppUser.GENDER_CHOICES)
    age = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} {self.surname} - Paciente"
    
