from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework import generics

from .models import AppTerminos
from .serializers import AppTerminosSerializer

# Create your views here.
class AppTerminosCreate(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        modifier = request.user

        if not modifier.is_admin:
            return Response({"error": "You have to be an admin to edit this"}, status=status.HTTP_403_FORBIDDEN)

        content = request.data.get('content')
        version = request.data.get('version')

        if AppTerminos.objects.filter(content=content).exists():
            return Response({"error": "A configuration with this content already exists"}, status=status.HTTP_400_BAD_REQUEST)

        AppTerminos.objects.create(
            content=content,
            version=version,
            modifier=modifier
        )

        return Response({"message": "Configuration created successfully"}, status=status.HTTP_201_CREATED)

class AppTerminosList(generics.ListAPIView):
    '''
    API endpoint that allows term of services to be viewed.
    '''
    def get(self, request, *args, **kwargs):
        modifier = request.user

        if not modifier.is_admin:
            return Response({"error": "You have to be an admin to edit this"}, status=status.HTTP_403_FORBIDDEN)

        queryset = AppTerminos.objects.all()
        #serializer_class = AppTerminosSerializer
        return Response(queryset)

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
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosDelete(generics.DestroyAPIView):
    '''
    API endpoint that allows a single term of service to be deleted.
    '''
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer
