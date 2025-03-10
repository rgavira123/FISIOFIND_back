from ..gestion_usuarios.models import Physiotherapist
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from ..gestion_usuarios.serializers import PhysioSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_physiotherapists_by_specialization(request, specialization_id):
    physiotherapists = Physiotherapist.objects.filter(physio_specializations__specialization=specialization_id)
    if not physiotherapists.exists():
        return Response({"detail": "No se encontró ningún fisioterapeuta con esa especialidad."}, status=status.HTTP_404_NOT_FOUND)
    serializer = PhysioSerializer(physiotherapists, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_physiotherapists_by_name(request, physio_name):
    # Parse the name to handle case insensitivity and split into first and last name
    name_parts = physio_name.split()
    if len(name_parts) == 1:
        physiotherapists = Physiotherapist.objects.filter(user__username__icontains=physio_name)
    else:
        first_name, last_name = name_parts[0], name_parts[1]
        physiotherapists = Physiotherapist.objects.filter(user__first_name__icontains=first_name, user__last_name__icontains=last_name)
    
    if not physiotherapists.exists():
        return Response({"detail": "No se encontró ningún fisioterapeuta con ese nombre."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PhysioSerializer(physiotherapists, many=True)
    return Response(serializer.data)