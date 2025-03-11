from django.urls import path
from gestion_citas import views
from rest_framework.urlpatterns import format_suffix_patterns
from gestion_citas.views import EditWeeklySchedule , AddUnavailableDay

urlpatterns = [
    path('<int:pk>/', views.AppointmentDetail.as_view()),
    path('schedule/<int:pk>/', views.get_physio_schedule_by_id),
    path('physio/schedule/weekly/', EditWeeklySchedule.as_view(), name='edit_weekly_schedule'),
    path('physio/schedule/add-unavailable/', AddUnavailableDay.as_view(), name='add_unavailable_day'),

    #Patients
    path('patient/', views.create_appointment_patient),
    path('patient/list/', views.list_appointments_patient),
    #Physiotherapists
    path('physio/', views.create_appointment_physio),
    path('physio/list/', views.list_appointments_physio),

    #Update and delete
    path('update/<int:appointment_id>/', views.update_appointment, name='update_appointment'),
    #Admin 
    path('admin/create/', views.AdminAppointmenCreate.as_view()),
    path('admin/list/', views.AdminAppointmenList.as_view()),
    path('admin/list/<int:pk>/', views.AdminAppointmennDetail.as_view()),
    path('admin/edit/<int:pk>/', views.AdminAppointmenUpdate.as_view()),
    path('admin/delete/<int:pk>/', views.AdminAppointmenDelete.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)