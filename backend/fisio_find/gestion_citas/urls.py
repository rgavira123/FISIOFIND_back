from django.urls import path
from gestion_citas import views
from rest_framework.urlpatterns import format_suffix_patterns
from gestion_citas.views import EditWeeklySchedule , AddUnavailableDay

urlpatterns = [
    path('appointment/<int:pk>/', views.AppointmentDetail.as_view()),
    path('appointment/schedule/<int:pk>/', views.get_physio_schedule_by_id),
    path('appointment/physio/schedule/weekly/', EditWeeklySchedule.as_view(), name='edit_weekly_schedule'),
    path('appointment/physio/schedule/add-unavailable/', AddUnavailableDay.as_view(), name='add_unavailable_day'),

    #Patients
    path('appointment/patient/', views.create_appointment_patient),
    path('appointment/patient/list/', views.list_appointments_patient),
    #Physiotherapists
    path('appointment/physio/', views.create_appointment_physio),
    path('appointment/physio/list/', views.list_appointments_physio),
    #Admin 
    path('appointment/admin/create/', views.AdminAppointmenCreate.as_view()),
    path('appointment/admin/list/', views.AdminAppointmenList.as_view()),
    path('appointment/admin/list/<int:pk>/', views.AdminAppointmennDetail.as_view()),
    path('appointment/admin/edit/<int:pk>/', views.AdminAppointmenUpdate.as_view()),
    path('appointment/admin/delete/<int:pk>/', views.AdminAppointmenDelete.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)