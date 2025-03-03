from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.response import Response
from gestion_terminos.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from .models import AppTerminos
from .serializers import AppTerminosSerializer

# Create your views here.
class AppTerminosCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosList(generics.ListAPIView):
    '''
    API endpoint that allows term of services to be viewed.
    '''
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosDetail(generics.RetrieveAPIView):
    '''
    API endpoint that returns a single term of service by pk.
    '''
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint that allows a single term of service to be updated.
    '''
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosDelete(generics.DestroyAPIView):
    '''
    API endpoint that allows a single term of service to be deleted.
    '''
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer
