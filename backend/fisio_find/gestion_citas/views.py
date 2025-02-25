from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from gestion_citas.models import Citas
from gestion_citas.serializers import CitasSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework import generics

class CitasList(generics.ListCreateAPIView):
    queryset = Citas.objects.all()
    serializer_class = CitasSerializer
    
class CitasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Citas.objects.all()
    serializer_class = CitasSerializer
