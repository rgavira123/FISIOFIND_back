from django.test import TestCase

from django.shortcuts import render
from gestion_citas.models import Citas
from gestion_citas.serializers import CitasSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser



cita1 = Citas(date="2025-03-01",  # Example date
    time="10:00:00",    # Example time
    patient_id=1,       # Example patient ID
    physiotherapist_id=1,  # Example physiotherapist ID
    reason="Consulta de rutina",  # Example reason
    status="pendiente")

cita1.save()

cita2 = Citas(date="2025-03-02",  # Example date
    time="14:30:00",    # Example time
    patient_id=2,       # Example patient ID
    physiotherapist_id=1,  # Example physiotherapist ID
    reason="Rehabilitación",  # Example reason
    status="pendiente")

cita2.save()

serializer = CitasSerializer(cita1)
serializer.data
content = JSONRenderer().render(serializer.data)
content
