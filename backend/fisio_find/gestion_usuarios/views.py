from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import PatientRegisterSerializer, PatientBasicSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import IsPatient

class PatientProfileView(APIView):
    permission_classes = [IsPatient]

    def get(self, request):
        patient = request.user.patient  # Aquí obtienes el paciente relacionado con el usuario
        serializer = PatientBasicSerializer(patient)
        return Response(serializer.data)
    
    def patch(self, request, *args, **kwargs):
        patient = request.user.patient
        print(f"👤 Usuario autenticado: {request.user.pk} - {request.user.username}")

        serializer = PatientBasicSerializer(patient, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            print("✅ Perfil actualizado correctamente")
            return Response(serializer.data, status=status.HTTP_200_OK)

        print(f"❌ Errores de validación: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
