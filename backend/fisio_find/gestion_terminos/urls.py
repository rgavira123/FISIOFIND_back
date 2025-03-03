from django.urls import path
from .views import AppTerminosCreate, AppTerminosList, AppTerminosDetail, AppTerminosUpdate, AppTerminosDelete, test_json_response

urlpatterns = [
    path('create/', AppTerminosCreate.as_view(), name='app_terminos_create'),
    path('list/', AppTerminosList.as_view(), name='app_terminos_list'),
    path('<int:pk>/', AppTerminosDetail.as_view(), name='app_terminos_detail'),
    path('update/<int:pk>/', AppTerminosUpdate.as_view(), name='app_terminos_update'),
    path('delete/<int:pk>/', AppTerminosDelete.as_view(), name='app_terminos_delete'),
    path('prueba/', test_json_response, name='test_json_response'),
]
