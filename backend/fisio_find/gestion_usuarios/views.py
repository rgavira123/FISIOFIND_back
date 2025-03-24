from django.shortcuts import get_object_or_404
import re
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer, PhysioRegisterSerializer,PhysioSerializer, PatientSerializer, AppUserSerializer, AppUserAdminViewSerializer, VideoSerializer

from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer, PhysioUpdateSerializer, PhysioRegisterSerializer, PhysioSerializer, PatientSerializer, AppUserSerializer, AppUserAdminViewSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Physiotherapist, Patient, AppUser, Video
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from .permissions import IsPhysiotherapist
#from permissions import IsAdmin
import boto3
from .permissions import IsPatient, IsPhysiotherapist, IsPhysioOrPatient
from .models import Patient

from rest_framework.permissions import IsAuthenticated
import json
from django.conf import settings
from django.http import HttpResponse, StreamingHttpResponse




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

@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])
def physio_update_view(request):
    """Actualiza los datos del fisioterapeuta autenticado"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Aplanar las claves 'user.*' para que coincidan con lo que espera el serializer
    request_data = {}
    for key, value in request.data.items():
        if key.startswith("user."):
            request_data[key[5:]] = value  # Quita el prefijo "user."
        else:
            request_data[key] = value
                

    # Serializar y validar los datos enviados
    serializer = PhysioRegisterSerializer(physio, data=request_data, partial=True)

    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Fisioterapeuta actualizado correctamente"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def physio_create_service_view(request):
    
    """Crea un nuevo servicio para el fisioterapeuta autenticado o actualiza los existentes"""
    
    # Obtener el fisioterapeuta asociado al usuario autenticado
    physio = get_object_or_404(Physiotherapist, user=request.user)
    
    # Obtener servicios existentes
    existing_services = physio.services or {}
    
    # Obtener nuevos servicios del request
    new_services = request.data.get('services', {})
    
    # Actualizar servicios existentes o añadir nuevos
    for service_name, service_data in new_services.items():
        if service_name in existing_services:
            # Si el servicio existe, actualizar sus propiedades
            for prop_key, prop_value in service_data.items():
                existing_services[service_name][prop_key] = prop_value
        else:
            # Si el servicio no existe, añadirlo completo
            existing_services[service_name] = service_data
    
    # Preparar los datos para el serializador
    update_data = {'services': existing_services}
    
    # Usar el serializador para actualización
    serializer = PhysioUpdateSerializer(physio, data=update_data, partial=True)
    
    if serializer.is_valid():
        serializer.update(physio, serializer.validated_data)
        return Response({"message": "Servicios actualizados correctamente"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def physio_get_services_view(request, physio_id):
    physio = get_object_or_404(Physiotherapist, id=physio_id)
    return Response(physio.services)

@api_view(['DELETE'])
def physio_delete_service_view(request, service_id):
    physio = get_object_or_404(Physiotherapist, user=request.user)
    services = physio.services
    if services is None:
        return Response({"message": "No hay servicios para eliminar"}, status=status.HTTP_200_OK)
    if service_id not in services:
        return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
    del services[service_id]
    physio.services = services
    physio.save()
    return Response({"message": "Servicio eliminado correctamente"}, status=status.HTTP_200_OK)

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


@api_view(['POST'])
@permission_classes([IsPhysiotherapist])
def create_file(request):
    print("🔍 Datos recibidos:", request.data)

    # Convertir request.data en un diccionario mutable (necesario para modificar `QueryDict`)
    mutable_data = request.data.copy()

    # Manejo de `patients`
    patients_raw = mutable_data.get("patients")
    if patients_raw:
        if isinstance(patients_raw, str):
            try:
                patients_list = json.loads(patients_raw)  # Convierte "[1, 3]" a [1, 3]
                if isinstance(patients_list, list) and all(isinstance(i, int) for i in patients_list):
                    mutable_data.setlist("patients", patients_list)  # Asegura que se guarde como lista
                else:
                    return Response({"error": "Formato de patients incorrecto, debe ser una lista de enteros"}, status=status.HTTP_400_BAD_REQUEST)
            except json.JSONDecodeError:
                return Response({"error": "Formato de patients inválido"}, status=status.HTTP_400_BAD_REQUEST)

    print("📌 Datos después de procesar:", mutable_data)  # Depuración

    # Pasamos `mutable_data` en lugar de `request.data`
    serializer = VideoSerializer(data=mutable_data, context={"request": request})

    if serializer.is_valid():
        video = serializer.save()
        return Response(
            {"message": "Archivo creado correctamente", "video": VideoSerializer(video).data},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsPhysiotherapist])
def delete_video(request, video_id):
    user = request.user
    print(user.physio.id)  # Depuración
    print(f"Usuario autenticado: {user}, Rol: {getattr(user, 'physiotherapist', None)}")  # Depuración
    try:
        video = Video.objects.get(id=video_id)
        print(f"Video encontrado: {video}")  # Depuración
    
        if not hasattr(user, 'physio') or video.physiotherapist.id != user.physio.id:
            return Response({"error": "No tienes permiso para eliminar este video"}, status=status.HTTP_403_FORBIDDEN)

        video.delete_from_storage()
        video.delete()

        return Response({"message": "Video eliminado correctamente"}, status=status.HTTP_200_OK)

    except Video.DoesNotExist:
        return Response({"error": "Video no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])  
def list_my_videos(request):
    user = request.user

    try:
        if hasattr(user, 'patient'):
            print("Patient:", user.patient.id)
            videos = Video.objects.filter(patients__id=user.patient.id)

        elif hasattr(user, 'physio'):
            print("Physio:", user.physio.id)
            videos = Video.objects.filter(physiotherapist=user.physio.id)

        else:
            return Response({"error": "No tienes permisos para ver estos videos"}, status=status.HTTP_403_FORBIDDEN)

        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error al obtener los videos: {e}")
        return Response({"error": "Hubo un problema al obtener los videos"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.DIGITALOCEAN_ACCESS_KEY_ID,
    aws_secret_access_key=settings.DIGITALOCEAN_SECRET_ACCESS_KEY,
    region_name=settings.DIGITALOCEAN_REGION,
    endpoint_url=settings.DIGITALOCEAN_ENDPOINT_URL,
)


@api_view(['GET'])
@permission_classes([IsPhysioOrPatient])
def stream_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        if request.user.id not in video.patients.values_list('id', flat=True):
            return Response({'error': 'No tienes acceso a este video'}, status=403)

        video_object = s3_client.get_object(
            Bucket=settings.DIGITALOCEAN_SPACE_NAME,
            Key=video.file_key
        )

        video_size = video_object["ContentLength"]
        video_body = video_object["Body"]

        # Manejar streaming por fragmentos (range requests)
        range_header = request.headers.get("Range", None)
        if range_header:
            range_value = range_header.replace("bytes=", "").split("-")
            start = int(range_value[0]) if range_value[0] else 0
            end = int(range_value[1]) if len(range_value) > 1 and range_value[1] else video_size - 1
            chunk_size = end - start + 1

            # Leer solo el fragmento necesario
            video_body.seek(start)
            video_chunk = video_body.read(chunk_size)

            # Responder con `206 Partial Content`
            response = HttpResponse(video_chunk, content_type="video/mp4")
            response["Content-Range"] = f"bytes {start}-{end}/{video_size}"
            response["Accept-Ranges"] = "bytes"
            response["Content-Length"] = str(chunk_size)
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"
            response.status_code = 206
        else:
            # Streaming completo en fragmentos
            def stream_file():
                for chunk in video_body.iter_chunks():
                    yield chunk

            response = StreamingHttpResponse(stream_file(), content_type="video/mp4")
            response["Content-Length"] = str(video_size)
            response["Accept-Ranges"] = "bytes"
            response["Cache-Control"] = "no-cache"
            response["Connection"] = "keep-alive"
        
        return response

    except Video.DoesNotExist:
        return Response({"error": "El video no existe"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['PUT'])
@permission_classes([IsPhysiotherapist])  # Solo usuarios autenticados pueden acceder
def update_video(request, video_id):
    try:
        # Obtener el video desde la BD
        video = Video.objects.get(id=video_id)

        # Verificar que el usuario autenticado es el fisioterapeuta propietario del video
        if request.user.physio != video.physiotherapist:
            return Response({'error': 'No tienes permiso para actualizar este video'}, status=status.HTTP_403_FORBIDDEN)

    except Video.DoesNotExist:
        return Response({'error': 'El video no existe'}, status=status.HTTP_404_NOT_FOUND)

    # Convertir request.data en un diccionario mutable
    mutable_data = request.data.copy()

    # Manejo de `patients`
    patients_raw = mutable_data.get("patients")
    if patients_raw:
        if isinstance(patients_raw, str):
            try:
                patients_list = json.loads(patients_raw)  # Convierte "[1, 3]" a [1, 3]
                if isinstance(patients_list, list) and all(isinstance(i, int) for i in patients_list):
                    mutable_data.setlist("patients", patients_list)  # Asegura que se guarde como lista
                else:
                    return Response({"error": "Formato de patients incorrecto, debe ser una lista de enteros"}, status=status.HTTP_400_BAD_REQUEST)
            except json.JSONDecodeError:
                return Response({"error": "Formato de patients inválido"}, status=status.HTTP_400_BAD_REQUEST)

    # Serializar con los datos nuevos
    serializer = VideoSerializer(video, data=mutable_data, partial=False, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Video actualizado correctamente", "video": serializer.data}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
