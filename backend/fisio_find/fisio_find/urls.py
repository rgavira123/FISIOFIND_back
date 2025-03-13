from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("¡Bienvenido a FisioFind!")

urlpatterns = [
    path('', home, name='home'),  # Agregar esta línea para la página principal
    path('admin/', admin.site.urls),
    path('api/app_user/', include('gestion_usuarios.urls')),
    path('api/appointment/', include('gestion_citas.urls')),
    path('api/terminos/', include('gestion_terminos.urls')),
    path('api/videocall/', include('videocall.urls')),
    path('api/sesion_invitado/', include('sesion_invitado.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
