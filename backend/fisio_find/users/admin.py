from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin 
from .models import AppUser, Patient, Physiotherapist, Admin
from .forms import AppUserCreationForm, AppUserChangeForm

class AppUserAdmin(BaseUserAdmin): 
    add_form = AppUserCreationForm
    form = AppUserChangeForm
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
    
    search_fields = ('username', 'email', 'dni', 'account_status')
    list_filter = ('account_status', 'is_staff', 'is_active', 'groups')

admin.site.register(AppUser, AppUserAdmin)
admin.site.register(Patient)
admin.site.register(Physiotherapist)
admin.site.register(Admin)
