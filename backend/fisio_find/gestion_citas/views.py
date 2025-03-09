from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from gestion_citas.models import Appointment
from gestion_citas.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from gestion_usuarios.permissions import IsPhysiotherapist, IsPatient
from gestion_usuarios.permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from gestion_citas.models import Appointment
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])
def create_appointment_patient(request):
    patient = request.user
    if hasattr(request.user, 'physio'):
        return Response({"error": "Los fisioterapeutas no pueden crear citas como pacientes"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()  
    data['patient'] = patient.id

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def create_appointment_physio(request):
    physiotherapist = request.user.physio
    if hasattr(request.user, 'patient'):
        return Response({"error": "Los pacientes no pueden crear citas como fisioterapeutas"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    data['physiotherapist'] = physiotherapist.id  

    serializer = AppointmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Buscar una forma de filtrar mas sencilla *funciona pero muchas lineas*
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPhysiotherapist])
def list_appointments_physio(request):
    physiotherapist = request.user.physio
    appointments = Appointment.objects.filter(physiotherapist=physiotherapist)

    status = request.query_params.get('status', None)
    if status:
        appointments = appointments.filter(status=status)

    is_online = request.query_params.get('is_online', None)
    if is_online is not None:
        appointments = appointments.filter(is_online=is_online.lower() == 'true')

    patient = request.query_params.get('patient', None)
    if patient:
        appointments = appointments.filter(patient=patient)

    search_filter = SearchFilter()
    search_fields = ['status']  
    appointments = search_filter.filter_queryset(request, appointments, view=None)

    ordering_filter = OrderingFilter()
    ordering_filter.ordering_fields = ['start_time', 'end_time'] 
    appointments = ordering_filter.filter_queryset(request, appointments, view=None)

    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(appointments, request)
    serializer = AppointmentSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPatient])
def list_appointments_patient(request):
    patient = request.user.patient
    appointments = Appointment.objects.filter(patient=patient)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

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