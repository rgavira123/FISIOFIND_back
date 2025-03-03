from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from gestion_citas.permissions import IsOwner
from gestion_citas.models import Appointment
from gestion_citas.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated

class AppointmentList(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['patient', 'physiotherapist', 'status', 'is_online']
    ordering_fields = ['start_time', 'end_time']

class AppointmentDetail(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated, IsOwner]
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer