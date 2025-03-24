from django.urls import path
from .views import patient_register_view, custom_token_obtain_view, logout_view, check_role_view, physio_register_view, return_user, physio_update_view, PatientProfileView, admin_list_patient_profiles, admin_list_physioterapist_profiles, admin_update_account_status, admin_delete_user 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('patient/register/', patient_register_view, name='patient_register'),
    path('login/', custom_token_obtain_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-role/', check_role_view, name='check_role'),
    path('physio/register/', physio_register_view, name='physio_register'),
    path('physio/update/', physio_update_view, name='physio_update'),
    path('profile/', PatientProfileView.as_view(), name='profile'),
    path('current-user/', return_user, name='current_user'),
    path('admin/patient/list/', admin_list_patient_profiles, name='admin_patient_list'),
    path('admin/physio/list/', admin_list_physioterapist_profiles, name='admin_physio_list'),
    path('admin/update-account-status/<int:user_id>/', admin_update_account_status, name='admin_update_account_status'),
    path('admin/delete-user/<int:user_id>/', admin_delete_user, name='admin_delete_user')
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

