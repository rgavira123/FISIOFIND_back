from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin  # 👈 esto es lo importante
from .models import AppUser, Patient, Physiotherapist, Admin
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(BaseUserAdmin):  # 👈 y aquí también
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = AppUser

    list_display = ['username', 'email', 'dni', 'account_status']

    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {
            'fields': ('photo', 'dni', 'phone_number', 'postal_code', 'account_status'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2',
                'photo', 'dni', 'phone_number', 'postal_code', 'account_status',
            ),
        }),
    )

admin.site.register(AppUser, CustomUserAdmin)
admin.site.register(Patient)
admin.site.register(Physiotherapist)
admin.site.register(Admin)
