from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.response import Response
from gestion_usuarios.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from datetime import datetime

from .models import AppTerminos
from .serializers import AppTerminosSerializer

# Create your views here.
class AppTerminosCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término.
    '''
    permission_classes = [IsAdmin]
    def post(self, request, *args, **kwargs):
        try:
            modifier = request.user
        except Exception:
            modifier = None
        modifier = None
        content = request.data.get('content')
        version = request.data.get('version')
        created_at = datetime.now()
        updated_at = datetime.now()

        AppTerminos.objects.create(
            content=content,
            version=version,
            modifier=modifier,
            created_at=created_at,
            updated_at=updated_at,
        )

        return Response({"message": "Configuration created successfully"}, status=status.HTTP_201_CREATED)


class AppTerminosList(generics.ListAPIView):
    '''
    API endpoint para listar los términos.
    '''
    permission_classes = [IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo término por su id.
    '''
    permission_classes = [AllowAny]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

class AppTerminosUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para actualizar un término.
    '''
    permission_classes = [IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer

    def put(self, request, *args, **kwargs):
        try:
            modifier = request.user
        except Exception:
            modifier = None
        pk = kwargs['pk']
        terminos = AppTerminos.objects.filter(pk=pk)

        if not terminos.exists():
            return Response({"error": "Esta configuración no existe"}, status=status.HTTP_404_NOT_FOUND)

        modifier = None
        content = request.data.get('content')
        version = request.data.get('version')
        updated_at = datetime.now()

        terminos.update(
            content=content,
            version=version,
            modifier=modifier,
            updated_at=updated_at,
        )

        return Response({"message": "Configuration updated successfully"}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        try:
            modifier = request.user
        except Exception:
            modifier = None
        pk = kwargs['pk']
        terminos = AppTerminos.objects.filter(pk=pk)

        if not terminos.exists():
            return Response({"error": "Esta configuración no existe"}, status=status.HTTP_404_NOT_FOUND)

        modifier = None
        content = request.data.get('content')
        if content != terminos.get().content:
            if AppTerminos.objects.filter(content=content).exists():
                return Response({"error": "A configuration with this content already exists"}, status=status.HTTP_400_BAD_REQUEST)

        version = request.data.get('version')
        updated_at = datetime.now()

        terminos.update(
            content=content,
            version=version,
            modifier=modifier,
            updated_at=updated_at,
        )

        return Response({"message": "Configuration updated successfully"}, status=status.HTTP_200_OK)

class AppTerminosDelete(generics.DestroyAPIView):
    '''
    API endpoint para eliminar un término.
    '''
    permission_classes = [IsAdmin]
    queryset = AppTerminos.objects.all()
    serializer_class = AppTerminosSerializer
