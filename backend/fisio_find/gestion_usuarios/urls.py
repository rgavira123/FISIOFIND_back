from django.urls import path
from .views import patient_register_view, custom_token_obtain_view, logout_view, check_role_view, physio_register_view, return_user, physio_update_view

urlpatterns = [
    path('patient/register/', patient_register_view, name='patient_register'),
    path('login/', custom_token_obtain_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check-role/', check_role_view, name='check_role'),
    path('physio/register/', physio_register_view, name='physio_register'),
    path('physio/update/', physio_update_view, name='physio_update'),
    path('current-user/', return_user, name='current_user')
]
    

