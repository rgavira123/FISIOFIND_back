from django.urls import path
from .views import patient_register_view, custom_token_obtain_view, logout_view, check_role_view, physio_register_view, return_user, physio_update_view, PatientProfileView, create_file#, AdminPatientList, AdminPatientCreate, AdminPatientnDetail, AdminPatientUpdate, AdminPatientDelete, AdminAppUserDetail
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
    path('create/file/', create_file, name='file_create'),
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

