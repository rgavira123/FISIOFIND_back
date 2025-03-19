from django.urls import path
from .views import (
    TreatmentCreateView,
    TreatmentListView,
    TreatmentDetailView,
    SetTreatmentStatusView
)

urlpatterns = [
    path('', TreatmentListView.as_view(), name='treatment-list'),
    path('create/', TreatmentCreateView.as_view(), name='treatment-create'),
    path('<int:pk>/', TreatmentDetailView.as_view(), name='treatment-detail'),
    path('<int:pk>/status/', SetTreatmentStatusView.as_view(), name='treatment-status'),
]