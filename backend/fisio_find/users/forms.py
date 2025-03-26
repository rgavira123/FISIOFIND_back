from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import AppUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = AppUser
        fields = ('username', 'email', 'dni', 'phone_number', 'postal_code', 'photo', 'account_status')

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = AppUser
        fields = ('username', 'email', 'dni', 'phone_number', 'postal_code', 'photo', 'account_status')
