from django.urls import path
from . import views

urlpatterns = [
    (path('specialization/<int:specialization_id>/', views.get_physiotherapists_by_specialization)),
    (path('name/<str:physio_name>/', views.get_physiotherapists_by_name)),
]
    

