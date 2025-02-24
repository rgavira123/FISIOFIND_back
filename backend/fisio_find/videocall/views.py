from django.shortcuts import render

# Create your views here.
def video_call(request, room_name):
    return render(request, 'room.html', {'room_name': room_name})