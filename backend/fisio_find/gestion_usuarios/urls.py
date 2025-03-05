from django.urls import path
from .views import CustomTokenObtainView, LogoutView, PatientRegisterView

urlpatterns = [
    path('patient/register/', PatientRegisterView.as_view(), name='patient_register'),
    path('login/', CustomTokenObtainView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
    

