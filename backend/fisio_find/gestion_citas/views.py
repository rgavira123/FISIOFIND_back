from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from gestion_citas.models import Citas
from gestion_citas.serializers import CitasSerializer

@csrf_exempt
def citas_list(request):
    """
    List all code citas, or create a new cita.
    """
    if request.method == 'GET':
        citas = Citas.objects.all()
        serializer = CitasSerializer(citas, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CitasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    
@csrf_exempt
def cita_detail(request, pk):
    """
    Retrieve, update or delete a code cita.
    """
    try:
        cita = cita.objects.get(pk=pk)
    except cita.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = CitasSerializer(cita)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = CitasSerializer(cita, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        cita.delete()
        return HttpResponse(status=204)