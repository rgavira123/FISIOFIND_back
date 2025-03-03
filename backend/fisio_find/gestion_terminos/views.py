from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics

from .models import AppTerminos
from .serializers import AppTerminosSerializer

# Create your views here.
class AppTerminosCreate(generics.CreateAPIView):
    '''
    API endpoint that allows creation of a new term of service.
    '''
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosList(generics.ListAPIView):
    '''
    API endpoint that allows term of services to be viewed.
    '''
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
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosDelete(generics.DestroyAPIView):
    '''
    API endpoint that allows a single term of service to be deleted.
    '''
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer
    
def test_json_response(request):
    '''
    API endpoint that returns a test JSON response.
    '''
    data = {
        'message': 'This is a test JSON response',
        'status': 'success'
    }
    return JsonResponse(data)