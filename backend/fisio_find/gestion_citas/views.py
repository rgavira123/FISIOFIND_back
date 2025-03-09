from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from gestion_citas.permissions import IsOwner
from gestion_citas.models import Appointment
from gestion_citas.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from gestion_usuarios.permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from gestion_citas.models import Appointment, Physiotherapist

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment_patient(request):
    patient = request.user
    data = request.data.copy()  
    data['patient'] = patient.id

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment_physio(request):
    user = request.user
    try:
        physiotherapist = Physiotherapist.objects.get(user=user)
    except Physiotherapist.DoesNotExist:
        return Response({"error": "El usuario no es un fisioterapeuta"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    data['physiotherapist'] = physiotherapist.id

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentDetail(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated, IsOwner]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
class AdminAppointmenCreate(generics.CreateAPIView):
    '''
    API endpoint para crear un término para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


class AdminAppointmenList(generics.ListAPIView):
    '''
    API endpoint para listar los términos para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmennDetail(generics.RetrieveAPIView):
    '''
    API endpoint que retorna un solo término por su id para admin.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmenUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint para que admin actualice un término.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AdminAppointmenDelete(generics.DestroyAPIView):
    '''
    API endpoint para que admin elimine un término.
    '''
    permission_classes = [IsAdmin]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer