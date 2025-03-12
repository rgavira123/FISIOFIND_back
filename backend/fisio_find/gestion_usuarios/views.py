from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PhysioRegisterSerializer, PhysioSerializer, PatientSerializer, AppUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Physiotherapist


@api_view(['POST'])
@permission_classes([AllowAny])
def patient_register_view(request):
    serializer = PatientRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Paciente registrado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_token_obtain_view(request):
    view = TokenObtainPairView.as_view()
    response = view(request._request)
    if 'access' in response.data:
        return Response({'access': response.data['access']})
    return Response(response.data, status=response.status_code)

@api_view(['POST'])
def logout_view(request):
    return Response({"message": "Logout exitoso."}, status=200)

@api_view(['GET'])
def check_role_view(request):
    user = request.user  # Obtenemos el usuario autenticado

    if hasattr(user, 'patient'):
        role = "patient"
    elif hasattr(user, 'physio'):
        role = "physiotherapist"
    elif hasattr(user, 'admin'):
        role = "admin"
    else:
        role = "unknown"

    return Response({"user_role": role})

@api_view(['GET'])
def return_user(request):
    user = request.user
    if hasattr(user, 'patient'):
        serializer = PatientSerializer(user.patient)
        user_serializer = AppUserSerializer(user.patient.user)
        return Response({"patient": {**serializer.data, "user_data": user_serializer.data}})
    elif hasattr(user, 'physio'):
        serializer = PhysioSerializer(user.physio)
        user_serializer = AppUserSerializer(user.physio.user)
        return Response({"physio": {**serializer.data, "user_data": user_serializer.data}})
    return Response({"error": "User role not found"}, status=status.HTTP_404_NOT_FOUND)


    


@api_view(['POST'])
@permission_classes([AllowAny])
def physio_register_view(request):
    serializer = PhysioRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Fisioterapeuta registrado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def physio_update_view(request):
    """Actualiza los datos del fisioterapeuta autenticado"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    print("Fisio", physio)
    
    # Serializar y validar los datos enviados
    serializer = PhysioRegisterSerializer(physio, data=request.data['user'], partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, request.data)
        return Response({"message": "Fisioterapeuta actualizado correctamente"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

