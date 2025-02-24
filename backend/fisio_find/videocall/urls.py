from django.urls import path
from .views import video_call

urlpatterns = [
    path('videocall/<str:room_name>/', video_call, name='video_call'),
]