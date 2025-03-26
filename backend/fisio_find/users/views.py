import logging
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PatientRegisterSerializer, PhysioUpdateSerializer, PhysioRegisterSerializer
from .serializers import PhysioSerializer, PatientSerializer, AppUserSerializer
from .models import AppUser, Physiotherapist, Patient, Specialization
from rest_framework import generics
from .permissions import IsPhysiotherapist
from .permissions import IsPatient
import json
from .permissions import IsAdmin
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView


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
    
    # Extraer especializaciones primero para manejarlas por separado
    specializations_data = None
    
    # Procesar el campo specializations
    if "specializations" in request.data:
        if isinstance(request.data["specializations"], str):
            try:
                # Intentar convertirlo desde un string JSON
                specializations_data = json.loads(request.data["specializations"])
            except json.JSONDecodeError:
                # Si no es JSON, podría ser una cadena separada por comas
                if "," in request.data["specializations"]:
                    specializations_data = [s.strip() for s in request.data["specializations"].split(",")]
                else:
                    # Si es un solo valor, crear una lista con ese valor
                    specializations_data = [request.data["specializations"]]
        elif isinstance(request.data["specializations"], list):
            specializations_data = request.data["specializations"]
    
    # Preparar datos para el serializador, excluyendo las especializaciones
    request_data = {}
    for key, value in request.data.items():
        if key == "specializations":
            continue  # Las procesamos después
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
        # Guardar primero los datos principales
        updated_physio = serializer.save()
        
        # Actualizar especializaciones
        if specializations_data is not None:
            try:
                # Obtenemos los IDs de las especializaciones existentes o las creamos si no existen
                specialization_ids = []
                for spec_name in specializations_data:
                    # Buscamos por nombre en el modelo de Specialization
                    spec, created = Specialization.objects.get_or_create(name=spec_name)
                    specialization_ids.append(spec.id)
                
                # Ahora asignamos los IDs al campo ManyToMany
                updated_physio.specializations.set(specialization_ids)
                
                # Guardar explícitamente después de modificar las relaciones M2M
                updated_physio.save()
                
                # Refrescar objeto para tener los datos actualizados
                updated_physio.refresh_from_db()
                
            except Exception as e:
                return Response({"error": f"Error al guardar especializaciones: {str(e)}"}, 
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Usar serializers para convertir los datos a JSON
        physio_serializer = PhysioSerializer(updated_physio)
        user_serializer = AppUserSerializer(updated_physio.user)
        
        response_data = {
            "message": "Fisioterapeuta actualizado correctamente"
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def physio_create_service_view(request):
    
    """Crea un nuevo servicio para el fisioterapeuta autenticado o actualiza el existente"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Obtener servicios existentes
    existing_services = physio.services or {}
    
    # Obtener nuevos servicios del request
    new_service = request.data
    
    # Actualizar servicios existentes o añadir nuevos
    service_title = new_service.get('id')
    if service_title in existing_services:
        # Si el servicio ya existe, actualizarlo
        existing_services[str(service_title)].update(new_service)
    else:
        # Si el servicio no existe, asignar una nueva ID única y añadirlo completo
        new_id = 1
        while str(new_id) in existing_services:
            new_id += 1
        new_service['id'] = new_id
        existing_services[str(new_id)] = new_service
    
    # Preparar los datos para el serializador
    update_data = {'services': existing_services}
    
    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente", "services": existing_services}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_service_view(request, service_id):
    
    """Actualiza un nuevo servicio para el fisioterapeuta autenticado o actualiza el existente"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Obtener servicios existentes
    existing_services = physio.services or {}
    
    # Obtener nuevos servicios del request
    new_service = request.data
    
    if str(service_id) not in existing_services:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
    existing_services[str(service_id)].update(new_service)

    # Preparar los datos para el serializador
    update_data = {'services': existing_services}
    
    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente", "services": existing_services}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def physio_get_services_view(_, physio_id):
    physio = get_object_or_404(Physiotherapist, id=physio_id)
    try:
        services = physio.services
        return Response(services)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def physio_delete_service_view(request, service_id):
    physio = get_object_or_404(Physiotherapist, user=request.user)
    services = physio.services or {}
    
    # Comprobar si el service_id está en alguno de los campos 'id' de los servicios
    if str(service_id) not in services:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
    
    # Eliminar el servicio
    del services[str(service_id)]
    physio.services = services
    physio.save()
    
    return Response({"message": "Servicio eliminado correctamente", "services": services}, status=status.HTTP_200_OK)

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
