from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import PatientRegisterSerializer, PatientAdminViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
#from permissions import IsAdmin
from gestion_usuarios.models import Patient

class PatientRegisterView(APIView):
    # Permite el acceso sin autenticación, pues es el registro
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PatientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Paciente registrado correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomTokenObtainView(TokenObtainPairView):

    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Solo devolvemos el access token
        return Response({'access': response.data['access']})

class LogoutView(APIView):

    def post(self, request):
        # Aquí podemos hacer lo que queramos, pero por ahora solo por dar constancia en el servidor
        return Response({"message": "Logout exitoso."}, status=200)
    
    
class CheckRoleView(APIView):

    def get(self, request):
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