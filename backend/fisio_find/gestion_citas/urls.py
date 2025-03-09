from django.urls import path
from gestion_citas import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('appointment/<int:pk>/', views.AppointmentDetail.as_view()),
    #Patients
    path('appointment/patient/', views.create_appointment_patient),
    #Physiotherapists
    path('appointment/physio/', views.create_appointment_physio),
    #Admin 
    path('appointment/admin/create/', views.AdminAppointmenCreate.as_view()),
    path('appointment/admin/list/', views.AdminAppointmenList.as_view()),
    path('appointment/admin/list/<int:pk>/', views.AdminAppointmennDetail.as_view()),
    path('appointment/admin/edit/<int:pk>/', views.AdminAppointmenUpdate.as_view()),
    path('appointment/admin/delete/<int:pk>/', views.AdminAppointmenDelete.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)