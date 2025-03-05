from django.urls import path
from gestion_citas import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('appointment/', views.AppointmentList.as_view()),
    path('appointment/<int:pk>/', views.AppointmentDetail.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)