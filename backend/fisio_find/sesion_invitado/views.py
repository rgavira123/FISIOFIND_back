import django_filters
from ..gestion_usuarios.models import Physiotherapist
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import viewsets
from ..gestion_usuarios.serializers import PhysioSerializer

from ..gestion_usuarios.models import Physiotherapist, Specialization

class PhysiotherapistFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='user__get_full_name', lookup_expr='icontains', label='Nombre Completo')
    surname = django_filters.CharFilter(field_name='user__last_name', lookup_expr='icontains', label='Apellido')
    specialization = django_filters.ModelChoiceFilter(field_name='physio_specializations__specialization', queryset=Specialization.objects.all(), label='Especialización')
    class Meta:
        model = Physiotherapist
        fields = ['name', 'surname', 'specialization']
        
class PhysiotherapistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Physiotherapist.objects.all()
    serializer_class = PhysioSerializer
    filterset_class = PhysiotherapistFilter
    
class PhysiotherapistSearchView(APIView):
    def get(self, request):
        name = request.query_params.get('name', '')
        specialization = request.query_params.get('specialization', '')
        physiotherapists = Physiotherapist.objects.filter(name__icontains=name, specialization__icontains=specialization)
        serializer = PhysioSerializer(physiotherapists, many=True)
        return Response(serializer.data)