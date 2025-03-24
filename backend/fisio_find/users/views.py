from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PhysioUpdateSerializer, PhysioRegisterSerializer
from .serializers import PhysioSerializer, PatientSerializer, AppUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Physiotherapist, Patient
from rest_framework import generics
from .permissions import IsPhysiotherapist
from .permissions import IsPatient
# Add this import if it's not already there
import json


class PatientProfileView(generics.RetrieveAPIView):
    permission_classes = [IsPatient]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            serializer = PatientSerializer(patient)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({"error": "Perfil de paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, *args, **kwargs):
        try:
            patient = Patient.objects.get(user=request.user)
            request_data = request.data.copy()

            user_data = request_data.get('user', {})
            user_data['id'] = request.user.id

            request_data['user'] = user_data

            serializer = PatientSerializer(patient, data=request_data, partial=True, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            print("Errores en PatientSerializer:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Patient.DoesNotExist:
            return Response({"error": "Perfil de paciente no encontrado"}, status=status.HTTP_404_NOT_FOUND)


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
@permission_classes([AllowAny])
def check_role_view(request):
    if not request.user.is_authenticated:
        return Response({"user_role": "unknown"})

    user = request.user

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
        return Response({"message": "Fisioteraputa registrado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_view(request):
    physio = get_object_or_404(Physiotherapist, user=request.user)

    request_data = {}
    for key, value in request.data.items():
        if key.startswith("user."):
            request_data[key[5:]] = value  # Remove "user." prefix
        else:
            request_data[key] = value

    # Ensure services are parsed as JSON if provided
    if "services" in request_data and isinstance(request_data["services"], str):
        try:
            request_data["services"] = json.loads(request_data["services"])
        except json.JSONDecodeError:
            return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)

    # Serialize and validate the data
    serializer = PhysioUpdateSerializer(physio, data=request_data, partial=True, context={'request': request})

    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Fisioterapeuta actualizado correctamente"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def physio_create_service(request):
    """Crea un nuevo servicio para el fisioterapeuta autenticado o actualiza los existentes"""
    physio = get_object_or_404(Physiotherapist, user=request.user)

    # Ensure services are parsed as JSON if provided
    new_services = request.data.get('services', {})
    if isinstance(new_services, str):
        try:
            new_services = json.loads(new_services)
        except json.JSONDecodeError:
            return Response({"error": "Formato de servicios inválido."}, status=status.HTTP_400_BAD_REQUEST)

    # Merge new services with existing ones
    existing_services = physio.services or {}
    for service_name, service_data in new_services.items():
        if service_name in existing_services:
            existing_services[service_name].update(service_data)
        else:
            existing_services[service_name] = service_data

    # Update the physiotherapist's services
    physio.services = existing_services
    physio.save()

    return Response({"message": "Servicios actualizados correctamente",
                    "services": existing_services}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def physio_get_services_view(request, physio_id):
    physio = get_object_or_404(Physiotherapist, id=physio_id)
    return Response(physio.services)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def physio_delete_service_view(request, service_name):
    try:
        # Get the physiotherapist profile
        physio = Physiotherapist.objects.get(user=request.user)
        
        # Get current services
        services = physio.services
        if isinstance(services, str):
            services = json.loads(services)
        elif services is None:
            services = {}
        
        # Check if the service exists
        if service_name not in services:
            return Response({"error": "Servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Remove the service
        del services[service_name]
        
        # Update the physiotherapist's services
        physio.services = services
        physio.save()
        
        return Response({"message": "Servicio eliminado correctamente"}, status=status.HTTP_200_OK)
    except Physiotherapist.DoesNotExist:
        return Response({"error": "Fisioterapeuta no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


"""
class AdminAppUserDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo user por su id para admin.
    '''
    permission_classes = [AllowAny]
    queryset = AppUser.objects.all()
    serializer_class = AppUserAdminViewSerializer

class AdminPatientCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término para admin.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer


class AdminPatientList(generics.ListAPIView):
    '''
    API endpoint para listar los pacientes para admin.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientAdminViewSerializer

class AdminPatientnDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo paciente por su id para admin.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientAdminViewSerializer

class AdminPatientUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para que admin actualice un término.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer

class AdminPatientDelete(generics.DestroyAPIView):
    '''
    API endpoint para que admin elimine un término.
    '''
    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer
"""
