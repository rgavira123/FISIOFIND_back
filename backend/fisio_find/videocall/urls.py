from django.urls import path
from .views import video_call, video_calls

urlpatterns = [
    path('videocalls/', video_calls, name='video_calls'),
    path('videocall/<str:room_name>/', video_call, name='video_call'),
]