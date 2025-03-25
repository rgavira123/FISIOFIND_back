from django.urls import path
from .views import AdminPatientDetail, AdminPhysioDetail, admin_search_patients_by_user, admin_search_physios_by_user, patient_register_view, physio_delete_service_view, physio_get_services_view, physio_create_service
from .views import custom_token_obtain_view, logout_view, check_role_view, physio_register_view, return_user, admin_list_patient_profiles, admin_list_physioterapist_profiles
from .views import admin_update_account_status, admin_remove_user   
from .views import physio_update_view, PatientProfileView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('patient/register/', patient_register_view, name='patient_register'),
    path('login/', custom_token_obtain_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-role/', check_role_view, name='check_role'),
    path('physio/register/', physio_register_view, name='physio_register'),
    path('physio/update/', physio_update_view, name='physio_update'),
    path('physio/create-service/', physio_create_service, name='physio_create_service'),
    # Change this line in urlpatterns
    path('physio/delete-service/<int:service_id>/', physio_delete_service_view, name='physio_delete_service'),
    # To this
    path('physio/delete-service/<str:service_name>/', physio_delete_service_view, name='physio_delete_service'),
    path('profile/', PatientProfileView.as_view(), name='profile'),
    path('current-user/', return_user, name='current_user'),
    path('services/<int:physio_id>/', physio_get_services_view, name='physio_get_xservices'),
    
    path('admin/patient/list/search/<str:query>/', admin_search_patients_by_user, name='admin_patient_list'),
    path('admin/physio/list/search/<str:query>/',admin_search_physios_by_user, name="admin_physio_list"),
    path('admin/patient/list/<int:pk>/', AdminPatientDetail.as_view(), name='admin_patient_detail'),
    path('admin/physio/list/<int:pk>/', AdminPhysioDetail.as_view(), name='admin_physio_detail'), 
    path('admin/patient/list/', admin_list_patient_profiles, name='admin_patient_list'),
    path('admin/physio/list/', admin_list_physioterapist_profiles, name='admin_physio_list'),
    path('admin/update-account-status/<int:user_id>/', admin_update_account_status, name='admin_update_account_status'),
    path('admin/remove-user/<int:user_id>/', admin_remove_user, name='admin_remove_user')   
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

"""
    path('admin/patient/list/', AdminPatientList.as_view(), name='admin_patient_list'),
    path('admin/patient/list/<int:pk>/', AdminPatientnDetail.as_view(), name='admin_patient_detail'),
    path('admin/patient/create/', AdminPatientCreate.as_view(), name='admin_patient_create'),
    path('admin/patient/edit/<int:pk>/', AdminPatientUpdate.as_view(), name='admin_patient_update'),
    path('admin/patient/delete/<int:pk>/', AdminPatientDelete.as_view(), name='admin_patient_delete'),
    path('admin/user/list/<int:pk>/', AdminAppUserDetail.as_view(), name='admin_app_user_detail'),

]
"""

