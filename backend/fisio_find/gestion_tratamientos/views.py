from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import ExerciseSession, Session, Treatment
from .serializers import ExerciseLogSerializer, ExerciseSerializer, ExerciseSessionSerializer, SessionSerializer, TreatmentSerializer, TreatmentDetailSerializer
from gestion_usuarios.models import Physiotherapist
from gestion_usuarios.models import Patient

class TreatmentCreateView(APIView):
    # Cambiamos a AllowAny temporalmente para pruebas
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Tomamos el ID del fisioterapeuta directamente del request para pruebas
        data = request.data.copy()
        
        serializer = TreatmentSerializer(data=data)
        if serializer.is_valid():
            treatment = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TreatmentListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Obtener el parámetro de filtro, si existe
        is_active_param = request.query_params.get('is_active', None)
        
        # Verificamos si el usuario es fisioterapeuta o paciente
        try:
            physiotherapist = Physiotherapist.objects.get(user=request.user)
            
            # Aplicar filtros base
            treatments = Treatment.objects.filter(physiotherapist=physiotherapist)
            
            # Aplicar filtro de activo/inactivo si se ha proporcionado
            if is_active_param is not None:
                is_active_value = is_active_param.lower() == 'true'
                treatments = treatments.filter(is_active=is_active_value)
                
            serializer = TreatmentDetailSerializer(treatments, many=True)
            return Response(serializer.data)
            
        except Physiotherapist.DoesNotExist:
            try:
                patient = Patient.objects.get(user=request.user)
                
                # Aplicar filtros base
                treatments = Treatment.objects.filter(patient=patient)
                
                # Aplicar filtro de activo/inactivo si se ha proporcionado
                if is_active_param is not None:
                    is_active_value = is_active_param.lower() == 'true'
                    treatments = treatments.filter(is_active=is_active_value)
                    
                serializer = TreatmentSerializer(treatments, many=True)
                return Response(serializer.data)
                
            except Patient.DoesNotExist:
                return Response(
                    {'detail': 'El usuario no es ni fisioterapeuta ni paciente'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

class TreatmentDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            treatment = Treatment.objects.get(pk=pk)
            
            # Verificamos que el usuario sea el fisioterapeuta o el paciente asociado
            is_authorized = False
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
                if treatment.physiotherapist == physiotherapist:
                    is_authorized = True
            except Physiotherapist.DoesNotExist:
                try:
                    patient = Patient.objects.get(user=request.user)
                    if treatment.patient == patient:
                        is_authorized = True
                except Patient.DoesNotExist:
                    pass
            
            if not is_authorized:
                return Response(
                    {'detail': 'No tiene permiso para ver este tratamiento'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = TreatmentDetailSerializer(treatment)
            return Response(serializer.data)
            
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request, pk):
        try:
            treatment = Treatment.objects.get(pk=pk)
            
            # Verificar si es fisioterapeuta o paciente del tratamiento
            is_physio = False
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
                if treatment.physiotherapist == physiotherapist:
                    is_physio = True
            except Physiotherapist.DoesNotExist:
                pass
                
            is_patient = False
            try:
                patient = Patient.objects.get(user=request.user)
                if treatment.patient == patient:
                    is_patient = True
            except Patient.DoesNotExist:
                pass
            
            if not (is_physio or is_patient):
                return Response(
                    {'detail': 'No tiene permiso para actualizar este tratamiento'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Si es paciente, solo puede actualizar el campo homework
            if is_patient and not is_physio:
                data = request.data.copy()
                allowed_fields = ['homework']
                for field in list(data.keys()):
                    if field not in allowed_fields:
                        data.pop(field)
                
                serializer = TreatmentSerializer(treatment, data=data, partial=True)
            else:
                # Si es fisioterapeuta, puede actualizar todos los campos
                serializer = TreatmentSerializer(treatment, data=request.data, partial=True)
                
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def delete(self, request, pk):
        try:
            treatment = Treatment.objects.get(pk=pk)
            
            # Solo el fisioterapeuta puede eliminar el tratamiento
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
                if treatment.physiotherapist != physiotherapist:
                    return Response(
                        {'detail': 'No tiene permiso para eliminar este tratamiento'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            except Physiotherapist.DoesNotExist:
                return Response(
                    {'detail': 'Debe ser fisioterapeuta para eliminar tratamientos'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            treatment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'}, 
                status=status.HTTP_404_NOT_FOUND
            )



class SetTreatmentStatusView(APIView):
    permission_classes = [AllowAny]
    
    def put(self, request, pk):
        try:
            # Verificar que el usuario sea fisioterapeuta
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
            except Physiotherapist.DoesNotExist:
                return Response(
                    {'detail': 'Debe ser fisioterapeuta para cambiar el estado del tratamiento'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Obtener el tratamiento
            treatment = Treatment.objects.get(pk=pk)
            
            # Verificar que el tratamiento pertenece a este fisioterapeuta
            if treatment.physiotherapist != physiotherapist:
                return Response(
                    {'detail': 'No tiene permiso para modificar este tratamiento'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Actualizar el estado del tratamiento (activo/inactivo)
            is_active = request.data.get('is_active')
            if is_active is not None:
                treatment.is_active = is_active
                treatment.save()
                serializer = TreatmentSerializer(treatment)
                return Response(serializer.data)
            else:
                return Response(
                    {'detail': 'Se debe indicar si el tratamiento está activo'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado el tratamiento'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            

# CREAR SESIONES
class SessionCreateView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            session = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# LISTAR SESIONES
class SessionListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, treatment_id):
        try:
            treatment = Treatment.objects.get(id=treatment_id)
            # Verificar que el usuario sea fisioterapeuta o paciente
            is_authorized = False
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
                if treatment.physiotherapist == physiotherapist:
                    is_authorized = True
            except Physiotherapist.DoesNotExist:
                try:
                    patient = Patient.objects.get(user=request.user)
                    if treatment.patient == patient:
                        is_authorized = True
                except Patient.DoesNotExist:
                    pass
            
            if not is_authorized:
                return Response(
                    {'detail': 'No tiene permiso para ver las sesiones de este tratamiento'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            sessions = treatment.sessions.all()
            serializer = SessionSerializer(sessions, many=True)
            return Response(serializer.data)
            
        except Treatment.DoesNotExist:
            return Response(
                {'detail': 'Tratamiento no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            

# CREAR EJERCICIOS
class ExerciseCreateView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ExerciseSerializer(data=request.data)
        if serializer.is_valid():
            exercise = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# ASIGNAR EJERCICIOS A UNA SESIÓN
class AssignExerciseToSessionView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ExerciseSessionSerializer(data=request.data)
        if serializer.is_valid():
            exercise_session = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# LISTAR EJERCICIOS DE UNA SESIÓN
class ExerciseListBySessionView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, session_id):
        try:
            session = Session.objects.get(id=session_id)
            treatment = session.treatment
            
            # Verificar que el usuario sea fisioterapeuta o paciente
            is_authorized = False
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
                if treatment.physiotherapist == physiotherapist:
                    is_authorized = True
            except Physiotherapist.DoesNotExist:
                try:
                    patient = Patient.objects.get(user=request.user)
                    if treatment.patient == patient:
                        is_authorized = True
                except Patient.DoesNotExist:
                    pass
            
            if not is_authorized:
                return Response(
                    {'detail': 'No tiene permiso para ver los ejercicios de esta sesión'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            exercises = session.exercise_sessions.all()
            serializer = ExerciseSessionSerializer(exercises, many=True)
            return Response(serializer.data)
            
        except Session.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión de ejercicios'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            

# REGISTRAR PROGRESO DEL PACIENTE EN LOS EJERCICIOS
class ExerciseLogCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExerciseLogSerializer(data=request.data)
        if serializer.is_valid():
            # Asignar automáticamente el paciente al usuario autenticado
            patient = Patient.objects.get(user=request.user)
            serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# OBTENER HISTORIAL DE REGISTROS DE UN EJERCICIO
class ExerciseLogListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, exercise_session_id):
        try:
            exercise_session = ExerciseSession.objects.get(id=exercise_session_id)
            session = exercise_session.session
            treatment = session.treatment
            
            # Verificar que el usuario sea fisioterapeuta o paciente
            is_authorized = False
            try:
                physiotherapist = Physiotherapist.objects.get(user=request.user)
                if treatment.physiotherapist == physiotherapist:
                    is_authorized = True
            except Physiotherapist.DoesNotExist:
                try:
                    patient = Patient.objects.get(user=request.user)
                    if treatment.patient == patient:
                        is_authorized = True
                except Patient.DoesNotExist:
                    pass
            
            if not is_authorized:
                return Response(
                    {'detail': 'No tiene permiso para ver los registros de este ejercicio'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            exercise_logs = exercise_session.exercise_logs.all()
            serializer = ExerciseLogSerializer(exercise_logs, many=True)
            return Response(serializer.data)
            
        except ExerciseSession.DoesNotExist:
            return Response(
                {'detail': 'No se ha encontrado la sesión de ejercicios'}, 
                status=status.HTTP_404_NOT_FOUND
            )