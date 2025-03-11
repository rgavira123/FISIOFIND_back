from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from gestion_citas.models import Appointment,Physiotherapist
from gestion_citas.serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from gestion_usuarios.permissions import IsPhysiotherapist, IsPatient
from gestion_usuarios.permissions import IsAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from datetime import datetime


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsPatient])
def create_appointment_patient(request):
    patient = request.user.patient
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_physio_schedule_by_id(request, pk):
    try:
        physiotherapist = Physiotherapist.objects.get(id=pk)
        print(f"Physiotherapist encontrado por ID {pk}: {physiotherapist.id}")

        schedule = physiotherapist.schedule
        if schedule is None:
            return Response({"message": "No se ha definido un horario para este fisioterapeuta"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"schedule": schedule}, status=status.HTTP_200_OK)
    except Physiotherapist.DoesNotExist:
        print(f"Physiotherapist con ID {pk} no encontrado")
        return Response({"error": "Fisioterapeuta no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error en get_physio_schedule_by_id: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class EditWeeklySchedule(APIView):
    permission_classes = [IsAuthenticated, IsPhysiotherapist]

    def put(self, request):
        try:
            physiotherapist = request.user.physio
            print(f"Physiotherapist autenticado: {physiotherapist.id} para usuario {request.user.id}")

            # Obtener el schedule existente
            current_schedule = physiotherapist.schedule or {
                "weekly_schedule": {"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []},
                "exceptions": {},
                "appointments": []
            }

            # Obtener los datos del cuerpo de la solicitud
            data = request.data

            # Validar la estructura del weekly_schedule
            if not isinstance(data, dict) or 'weekly_schedule' not in data:
                raise ValidationError("Debe enviar un objeto JSON con el campo 'weekly_schedule'.")

            weekly_schedule = data['weekly_schedule']
            if not isinstance(weekly_schedule, dict):
                raise ValidationError("weekly_schedule debe ser un diccionario.")
            valid_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            for day, schedules in weekly_schedule.items():
                if day.lower() not in valid_days:
                    raise ValidationError(f"{day} no es un día válido. Usa: {', '.join(valid_days)}.")
                if not isinstance(schedules, list):
                    raise ValidationError(f"Los horarios para {day} deben ser una lista.")
                for schedule in schedules:
                    if not isinstance(schedule, dict) or 'start' not in schedule or 'end' not in schedule:
                        raise ValidationError(f"El horario {schedule} no es válido. Debe ser un objeto con 'start' y 'end'.")
                    start, end = schedule['start'], schedule['end']
                    if not self._is_valid_time(start) or not self._is_valid_time(end):
                        raise ValidationError(f"Los horarios {start} o {end} no son válidos. Usa formato 'HH:MM'.")
                    if not self._is_valid_time_range(start, end):
                        raise ValidationError(f"El rango {start}-{end} no es válido. La hora de inicio debe ser anterior a la de fin.")

            # Actualizar solo el weekly_schedule en el schedule existente
            current_schedule['weekly_schedule'] = weekly_schedule

            # Obtener las citas actualizadas
            appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
            current_schedule['appointments'] = [
                {
                    "start_time": appointment.start_time.strftime('%Y-%m-%dT%H:%M:%S'),
                    "end_time": appointment.end_time.strftime('%Y-%m-%dT%H:%M:%S'),
                    "status": appointment.status
                }
                for appointment in appointments
            ]

            # Guardar el schedule actualizado
            physiotherapist.schedule = current_schedule
            physiotherapist.save()
            print(f"Weekly schedule actualizado para Physiotherapist ID {physiotherapist.id}")

            return Response({"message": "Horario semanal actualizado con éxito", "schedule": physiotherapist.schedule}, status=status.HTTP_200_OK)
        except ValidationError as ve:
            print(f"Validación fallida: {str(ve)}")
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error en EditWeeklySchedule: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def _is_valid_time(self, time_str):
        """Validar que un horario esté en formato 'HH:MM'."""
        try:
            datetime.strptime(time_str, '%H:%M')
            hour, minute = map(int, time_str.split(':'))
            return 0 <= hour <= 23 and 0 <= minute <= 59
        except ValueError:
            return False

    def _is_valid_time_range(self, start, end):
        """Validar que el rango de tiempo sea lógico (inicio antes de fin)."""
        try:
            start_hour, start_min = map(int, start.split(':'))
            end_hour, end_min = map(int, end.split(':'))
            start_minutes = start_hour * 60 + start_min
            end_minutes = end_hour * 60 + end_min
            return start_minutes < end_minutes
        except ValueError:
            return False
        
class AddUnavailableDay(APIView):
    permission_classes = [IsAuthenticated, IsPhysiotherapist]

    def post(self, request):
        try:
            physiotherapist = request.user.physio
            print(f"Physiotherapist autenticado: {physiotherapist.id} para usuario {request.user.id}")

            # Obtener el schedule existente
            current_schedule = physiotherapist.schedule or {
                "weekly_schedule": {"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []},
                "exceptions": {},
                "appointments": []
            }

            # Obtener los datos del cuerpo de la solicitud
            data = request.data

            # Validar la estructura
            if not isinstance(data, dict) or 'date' not in data or 'time_ranges' not in data:
                raise ValidationError("Debe enviar un objeto JSON con los campos 'date' y 'time_ranges'.")
            date_str = data['date']
            time_ranges = data['time_ranges']

            # Validar la fecha
            try:
                datetime.strptime(date_str, '%Y-%m-%d')
            except ValueError:
                raise ValidationError(f"{date_str} no es una fecha válida. Usa formato YYYY-MM-DD.")

            # Validar los rangos de tiempo
            if not isinstance(time_ranges, list):
                raise ValidationError("time_ranges debe ser una lista.")
            for time_range in time_ranges:
                if not isinstance(time_range, dict) or 'start' not in time_range or 'end' not in time_range:
                    raise ValidationError(f"El rango {time_range} no es válido. Debe ser un objeto con 'start' y 'end'.")
                start, end = time_range['start'], time_range['end']
                if not self._is_valid_time(start) or not self._is_valid_time(end):
                    raise ValidationError(f"Los horarios {start} o {end} no son válidos. Usa formato 'HH:MM'.")
                if not self._is_valid_time_range(start, end):
                    raise ValidationError(f"El rango {start}-{end} no es válido. La hora de inicio debe ser anterior a la de fin.")

            # Añadir o actualizar la fecha en exceptions con deduplicación
            if date_str not in current_schedule['exceptions']:
                current_schedule['exceptions'][date_str] = []

            existing_ranges = current_schedule['exceptions'][date_str]
            new_ranges = []
            for time_range in time_ranges:
                range_key = (time_range['start'], time_range['end'])
                if not any((existing['start'], existing['end']) == range_key for existing in existing_ranges):
                    new_ranges.append(time_range)
            current_schedule['exceptions'][date_str].extend(new_ranges)

            # Obtener las citas actualizadas
            appointments = Appointment.objects.filter(physiotherapist=physiotherapist)
            current_schedule['appointments'] = [
                {
                    "start_time": appointment.start_time.strftime('%Y-%m-%dT%H:%M:%S'),
                    "end_time": appointment.end_time.strftime('%Y-%m-%dT%H:%M:%S'),
                    "status": appointment.status
                }
                for appointment in appointments
            ]

            # Guardar el schedule actualizado
            physiotherapist.schedule = current_schedule
            physiotherapist.save()
            print(f"Día no disponible {date_str} añadido para Physiotherapist ID {physiotherapist.id}")

            return Response({"message": f"Día no disponible {date_str} añadido con éxito", "schedule": physiotherapist.schedule}, status=status.HTTP_200_OK)
        except ValidationError as ve:
            print(f"Validación fallida: {str(ve)}")
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error en AddUnavailableDay: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #Reutilizados en EditWeeklySchedule
    def _is_valid_time(self, time_str):
        """Validar que un horario esté en formato 'HH:MM'."""
        try:
            datetime.strptime(time_str, '%H:%M')
            hour, minute = map(int, time_str.split(':'))
            return 0 <= hour <= 23 and 0 <= minute <= 59
        except ValueError:
            return False

    def _is_valid_time_range(self, start, end):
        """Validar que el rango de tiempo sea lógico (inicio antes de fin)."""
        try:
            start_hour, start_min = map(int, start.split(':'))
            end_hour, end_min = map(int, end.split(':'))
            start_minutes = start_hour * 60 + start_min
            end_minutes = end_hour * 60 + end_min
            return start_minutes < end_minutes
        except ValueError:
            return False
        
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