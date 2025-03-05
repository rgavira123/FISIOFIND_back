from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/app_user/', include('gestion_usuarios.urls')),
    path('app_user/', include('gestion_usuarios.urls')),
    path('app_appointment/', include('gestion_citas.urls')),
]
