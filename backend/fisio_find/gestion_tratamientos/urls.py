from django.urls import path
from .views import (
    TreatmentCreateView, PhysiotherapistTreatmentListView, PatientTreatmentListView, TreatmentDetailView,
    SessionCreateView, SessionListView, SessionDetailView,
    ExerciseCreateView, ExerciseListView, ExerciseDetailView, ExerciseSearchView, ExerciseByAreaView,
    AssignExerciseToSessionView, UnassignExerciseFromSessionView, ExerciseListBySessionView,
    SeriesCreateView, SeriesDetailView,
    ExerciseLogCreateView, ExerciseLogListView, ExerciseLogDetailView
)

urlpatterns = [
    # Tratamientos
    path('treatments/create/', TreatmentCreateView.as_view(), name='create_treatment'),
    path('treatments/physio/', PhysiotherapistTreatmentListView.as_view(), name='physio_treatment_list'),
    path('treatments/patient/', PatientTreatmentListView.as_view(), name='patient_treatment_list'),
    path('treatments/<int:pk>/', TreatmentDetailView.as_view(), name='treatment_detail'),

    # Sesiones dentro de un tratamiento
    path('treatments/<int:treatment_id>/sessions/create/', SessionCreateView.as_view(), name='create_session'),
    path('treatments/<int:treatment_id>/sessions/', SessionListView.as_view(), name='session_list'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session_detail'),

    # Ejercicios
    path('exercises/create/', ExerciseCreateView.as_view(), name='create_exercise'),
    path('exercises/', ExerciseListView.as_view(), name='exercise_list'),
    path('exercises/<int:pk>/', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercises/search/', ExerciseSearchView.as_view(), name='search_exercise'),
    path('exercises/by-area/', ExerciseByAreaView.as_view(), name='exercise_by_area'),

    # Asignación de ejercicios a sesiones
    path('sessions/<int:session_id>/assign-exercise/', AssignExerciseToSessionView.as_view(), name='assign_exercise'),
    path('exercise-sessions/<int:exercise_session_id>/unassign-exercise/', UnassignExerciseFromSessionView.as_view(), name='unassign_exercise'),
    path('sessions/<int:session_id>/exercises/', ExerciseListBySessionView.as_view(), name='exercise_list_by_session'),

    # Series dentro de ejercicios en sesiones
    path('exercise-sessions/<int:exercise_session_id>/series/create/', SeriesCreateView.as_view(), name='create_series'),
    path('series/<int:pk>/', SeriesDetailView.as_view(), name='series_detail'),

    # Registro de progreso en ejercicios
    path('exercise-logs/create/', ExerciseLogCreateView.as_view(), name='create_exercise_log'),
    path('exercise-sessions/<int:exercise_session_id>/logs/', ExerciseLogListView.as_view(), name='exercise_log_list'),
    path('exercise-logs/<int:pk>/', ExerciseLogDetailView.as_view(), name='exercise_log_detail'),
]
