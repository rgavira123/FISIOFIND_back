from django.shortcuts import render
""" from .models import Room """

# Create your views here.
def video_call(request, room_name):
    return render(request, 'room.html', {'room_name': room_name})

def video_calls(request):
    return render(request, 'video_calls.html')

# Codigo para mostrar salas activas
""" 
def video_calls(request):
    rooms = Room.objects.all()  # Obtener todas las salas activas
    return render(request, 'video_calls.html', {'rooms': rooms}) """

