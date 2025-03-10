from django.urls import path
from .views import CheckRoleView, CustomTokenObtainView, LogoutView, PatientRegisterView, AdminPatientList, AdminPatientCreate, AdminPatientnDetail, AdminPatientUpdate, AdminPatientDelete

urlpatterns = [
    path('patient/register/', PatientRegisterView.as_view(), name='patient_register'),
    path('login/', CustomTokenObtainView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-role/', CheckRoleView.as_view(), name='check_role'),
    
    path('admin/patient/list/', AdminPatientList.as_view(), name='admin_patient_list'),
    path('admin/patient/list/<int:pk>/', AdminPatientnDetail.as_view(), name='admin_patient_detail'),
    path('admin/patient/create/', AdminPatientCreate.as_view(), name='admin_patient_create'),
    path('admin/patient/edit/<int:pk>/', AdminPatientUpdate.as_view(), name='admin_patient_update'),
    path('admin/patient/delete/<int:pk>/', AdminPatientDelete.as_view(), name='admin_patient_delete'),
]
    

