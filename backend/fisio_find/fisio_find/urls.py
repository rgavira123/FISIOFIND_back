from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/app_user/', include('gestion_usuarios.urls')),
    path('api/app_appointment/', include('gestion_citas.urls')),
    path('api/terminos/', include('gestion_terminos.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

