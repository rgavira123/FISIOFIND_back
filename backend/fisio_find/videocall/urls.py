# urls.py

from django.urls import path
from .views import RoomCreateView, RoomJoinView

urlpatterns = [
    path('create-room/', RoomCreateView.as_view(), name='create_room'),
    path('join-room/<str:code>/', RoomJoinView.as_view(), name='join_room'),
]