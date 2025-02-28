from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password, make_password

from .models import AppUser, Patient
from .serializers import AppUserSerializer

class PatientRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')
        surname = request.data.get('surname')
        dni = request.data.get('dni')
        phone_number = request.data.get('phone_number')
        postal_code = request.data.get('postal_code')
        gender = request.data.get('gender')
        age = request.data.get('age')
        photo = request.data.get('photo')


        if AppUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if AppUser.objects.filter(dni=dni).exists():
            return Response({"error": "DNI already exists"}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)
        patient = Patient.objects.create(
            username=username,  
            email=email,
            password=hashed_password,
            name=name,
            surname=surname,
            dni=dni,
            phone_number=phone_number,
            postal_code=postal_code,
            gender=gender,
            age=age,
            photo=photo
        )

        return Response({"message": "Patient registered successfully"}, status=status.HTTP_201_CREATED)

class PatientLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = AppUser.objects.get(username=username)
        except AppUser.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if check_password(password, user.password):
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
class AppUserCreate(generics.CreateAPIView):
    '''
    API endpoint that allows creation of a new app user.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserList(generics.ListAPIView):
    '''
    API endpoint that allows app users to be viewed.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserDetail(generics.RetrieveAPIView):
    '''
    API endpoint that returns a single app user by pk.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserUpdate(generics.RetrieveUpdateAPIView):
    '''
    API endpoint that allows a single app user to be updated.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class AppUserDelete(generics.DestroyAPIView):
    '''
    API endpoint that allows a single app user to be deleted.
    '''
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer
    
def test_json_response(request):
    '''
    API endpoint that returns a test JSON response.
    '''
    data = {
        'message': 'This is a test JSON response',
        'status': 'success'
    }
    return JsonResponse(data)