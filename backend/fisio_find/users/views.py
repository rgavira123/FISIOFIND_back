import logging
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer, PhysioRegisterSerializer, PhysioSerializer, PatientSerializer, AppUserSerializer, AppUserAdminViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Physiotherapist, Patient, AppUser, Admin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from .permissions import IsAdmin, IsPatient, IsPhysiotherapist
from .models import ACCOUNT_STATUS_CHOICES

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
        logging.error("An error occurred while deleting a service: %s", str(e))
        return Response({"error": "An internal error has occurred."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_search_patients_by_user(request, query):
    matched_users = AppUser.objects.filter(
        Q(dni__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    )

    patients = Patient.objects.filter(user__in=matched_users)
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_search_physios_by_user(request, query):
    matched_users = AppUser.objects.filter(
        Q(dni__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    )

    physios = Physiotherapist.objects.filter(user__in=matched_users)
    serializer = PhysioSerializer(physios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class AdminPatientDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo paciente por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
class AdminPhysioDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo paciente por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Physiotherapist.objects.all()
    serializer_class = PhysioSerializer


class AdminAppUserDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo user por su id para admin.
    '''
    permission_classes = [AllowAny]
    queryset = AppUser.objects.all()
    serializer_class = AppUserAdminViewSerializer
    

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_list_patient_profiles(request):
    user = request.user
    if hasattr(user, 'admin'):
        patients = Patient.objects.all()   
        patient_data = [{
            "patient": PatientSerializer(patient).data,
            "user_data": AppUserSerializer(patient.user).data
        } for patient in patients]
        return Response({"patients": patient_data}, status=status.HTTP_200_OK)
    return Response({"error": "No tienes permisos para ver esta información."}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_list_physioterapist_profiles(request):
    user = request.user
    if hasattr(user, 'admin'):
        physioterapists = Physiotherapist.objects.all()   
        physioterapist_data = [{
            "physioterapist": PhysioSerializer(physioterapist).data,
            "user_data": AppUserSerializer(physioterapist.user).data
        } for physioterapist in physioterapists]
        return Response({"physioterapists": physioterapist_data}, status=status.HTTP_200_OK)

    return Response({"error": "No tienes permisos para ver esta información."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['PATCH'])
@permission_classes([IsAdmin])
def admin_remove_user(request, user_id):
    user_to_update = get_object_or_404(AppUser, id=user_id)

    if hasattr(user_to_update, 'admin'):
        return Response({"error": "No puedes eliminar a otro administrador."}, status=status.HTTP_403_FORBIDDEN)
    
    user_to_update.account_status = "REMOVED"
    user_to_update.save()

    return Response({"message": "Usuario marcado como REMOVED correctamente. Para eliminarlo, debe hacerlo directamente desde la base de datos."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def admin_update_account_status(request, user_id):
    user_to_update = get_object_or_404(AppUser, id=user_id)

    new_status = request.data.get('account_status')
    if not new_status:
        return Response({"error": "Debes proporcionar un nuevo estado de cuenta."}, status=status.HTTP_400_BAD_REQUEST)

    valid_statuses = [choice[0] for choice in ACCOUNT_STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response({"error": "Estado de cuenta inválido."}, status=status.HTTP_400_BAD_REQUEST)

    user_to_update.account_status = new_status
    user_to_update.save()

    return Response({"message": "Estado de cuenta actualizado correctamente.", "new_status": new_status}, status=status.HTTP_200_OK)

'''
class AdminPatientDelete(generics.DestroyAPIView):
    
    #API endpoint para que admin elimine un término.

    permission_classes = [AllowAny]
    queryset = Patient.objects.all()
    serializer_class = PatientRegisterSerializer
'''
