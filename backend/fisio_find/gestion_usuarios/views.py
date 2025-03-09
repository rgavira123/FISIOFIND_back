from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import PatientRegisterSerializer, PatientSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import IsPatient
from .models import Patient
from rest_framework.permissions import IsAuthenticated

class PatientProfileView(APIView):
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
