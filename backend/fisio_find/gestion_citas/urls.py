from django.urls import path
from gestion_citas import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('citas/', views.CitasList.as_view()),
    path('citas/<int:pk>/', views.CitasDetail.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)