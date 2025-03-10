from django.urls import path
from . import views

urlpatterns = [
    path('physiotherapists/', views.PhysiotherapistViewSet.as_view({'get': 'list'}), name='physiotherapists')
]
    

