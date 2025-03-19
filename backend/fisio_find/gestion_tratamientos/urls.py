from django.urls import path
from .views import (
    TreatmentCreateView,
    TreatmentListView,
    TreatmentDetailView,
    SetTreatmentStatusView, SessionCreateView, SessionListView, ExerciseCreateView, AssignExerciseToSessionView, 
    ExerciseListBySessionView, ExerciseLogCreateView, ExerciseLogListView
)

urlpatterns = [
    path('', TreatmentListView.as_view(), name='treatment-list'),
    path('create/', TreatmentCreateView.as_view(), name='treatment-create'),
    path('<int:pk>/', TreatmentDetailView.as_view(), name='treatment-detail'),
    path('<int:pk>/status/', SetTreatmentStatusView.as_view(), name='treatment-status'),
    
    path('sessions/', SessionCreateView.as_view(), name='session-create'),
    path('sessions/<int:treatment_id>/', SessionListView.as_view(), name='session-list'),

    path('exercises/', ExerciseCreateView.as_view(), name='exercise-create'),
    path('sessions/<int:session_id>/exercises/', ExerciseListBySessionView.as_view(), name='exercise-list'),
    path('assign-exercise/', AssignExerciseToSessionView.as_view(), name='assign-exercise'),

    path('exercise-log/', ExerciseLogCreateView.as_view(), name='exercise-log-create'),
    path('exercise-log/<int:exercise_session_id>/', ExerciseLogListView.as_view(), name='exercise-log-list'),
]