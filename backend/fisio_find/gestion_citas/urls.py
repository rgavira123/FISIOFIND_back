from django.urls import path
from gestion_citas import views

urlpatterns = [
    path('citas/', views.citas_list),
    path('citas/<int:pk>/', views.cita_detail),
]