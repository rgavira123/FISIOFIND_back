"use client";

import { useState, useEffect, useCallback } from "react";
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";

type AreaChoice =
  | "UPPER_BODY"
  | "LOWER_BODY"
  | "CORE"
  | "FULL_BODY"
  | "SHOULDER"
  | "ARM"
  | "CHEST"
  | "BACK"
  | "QUADRICEPS"
  | "HAMSTRINGS"
  | "GLUTES"
  | "CALVES"
  | "NECK"
  | "LOWER_BACK"
  | "HIP"
  | "BALANCE"
  | "MOBILITY"
  | "STRETCHING"
  | "PROPRIOCEPTION";

interface Exercise {
  id: number;
  title: string;
  description: string;
  area: AreaChoice;
  physiotherapist: number;
}

interface ExerciseSessionData {
  exercise: Exercise;
  exerciseSessionId: number;
}

const ExercisesPage = ({
  params,
}: {
  params: { id: string; sessionId: string };
}) => {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showExistingExercises, setShowExistingExercises] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    area: "UPPER_BODY" as AreaChoice,
  });

  const loadAvailableExercises = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercises/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allExercises = await response.json();
      // Filtrar ejercicios que ya están en la sesión
      const exerciseIds = exercises.map(ex => ex.exercise.id);
      const filtered = allExercises.filter(
        (exercise: Exercise) => !exerciseIds.includes(exercise.id)
      );
      setAvailableExercises(filtered);
    } catch (err) {
      setError("Error al cargar los ejercicios disponibles");
      console.log(err);
    }
  };

  const handleAssignExercise = async (exerciseId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${params.sessionId}/assign-exercise/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercise: exerciseId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadSessionExercises();
      await loadAvailableExercises();
      setShowExistingExercises(false);
    } catch (err) {
      setError("Error al asignar el ejercicio");
      console.log(err);
    }
  };

  const loadSessionExercises = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${
          params.sessionId
        }/exercises/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const exercisesList: ExerciseSessionData[] = [];
      for (const exerciseSession of data) {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercises/${
            exerciseSession.exercise
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const exerciseData = await response.json();
        exercisesList.push({
          exercise: exerciseData,
          exerciseSessionId: exerciseSession.id
        });
      }

      setExercises(exercisesList);
    } catch (err) {
      setError("Error al cargar los ejercicios de la sesión");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [params.sessionId]);

  useEffect(() => {
    loadSessionExercises();
  }, []);

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      // Crear el ejercicio
      const createResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercises/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExercise),
        }
      );

      if (!createResponse.ok) {
        throw new Error(`HTTP error! status: ${createResponse.status}`);
      }

      const createData = await createResponse.json();

      // Asignar el ejercicio creado a la sesión
      const assignResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${
          params.sessionId
        }/assign-exercise/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercise: createData.id }),
        }
      );

      if (!assignResponse.ok) {
        throw new Error(`HTTP error! status: ${assignResponse.status}`);
      }

      setNewExercise({
        title: "",
        description: "",
        area: "UPPER_BODY" as AreaChoice,
      });
      setShowForm(false);
      loadSessionExercises();
    } catch (err) {
      setError("Error al crear y asignar el ejercicio");
      console.log(err);
    }
  };

  const handleUnassignExercise = async (exerciseSessionId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSessionId}/unassign-exercise/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      loadSessionExercises();
    } catch (err) {
      setError("Error al desasignar el ejercicio");
      console.log(err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push(`/gestion-fisio/seguimiento/${params.id}/sesiones`)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl inline-flex items-center mb-6"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ejercicios de la Sesión</h1>
        {!showForm && !showExistingExercises && (
          <div className="flex space-x-4 mb-8 mt-8">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{"Crear Nuevo Ejercicio"}</span>
            </button>
            <button
              onClick={() => {
                setShowExistingExercises(true);
                loadAvailableExercises();
              }}
              className="px-6 py-3 bg-[#05668d] text-white font-medium rounded-xl hover:bg-[#045a7c] focus:outline-none focus:ring-2 focus:ring-[#05668d] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{"Añadir Ejercicio Existente"}</span>
            </button>
          </div>
        )}

        {showExistingExercises && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ejercicios Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-gray-50 p-6 rounded-xl shadow transition-all duration-200 hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {exercise.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{exercise.description}</p>
                  <p className="text-gray-500 mb-4">Área: {exercise.area}</p>
                  <button
                    onClick={() => handleAssignExercise(exercise.id)}
                    className="w-full px-4 py-2 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200"
                  >
                    Añadir a la Sesión
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExistingExercises(false)}
              className="mt-6 px-6 py-3 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleCreateExercise}
            className="mb-8 p-6 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newExercise.title}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newExercise.description}
                  onChange={(e) =>
                    setNewExercise({
                      ...newExercise,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <select
                  value={newExercise.area}
                  onChange={(e) =>
                    setNewExercise({
                      ...newExercise,
                      area: e.target.value as AreaChoice,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
                  required
                >
                  <option value="UPPER_BODY">Parte Superior del Cuerpo</option>
                  <option value="LOWER_BODY">Parte Inferior del Cuerpo</option>
                  <option value="CORE">Zona Media/Core</option>
                  <option value="FULL_BODY">Cuerpo Completo</option>
                  <option value="SHOULDER">Hombros</option>
                  <option value="ARM">Brazos (Bíceps, Tríceps)</option>
                  <option value="CHEST">Pecho</option>
                  <option value="BACK">Espalda</option>
                  <option value="QUADRICEPS">Cuádriceps</option>
                  <option value="HAMSTRINGS">Isquiotibiales</option>
                  <option value="GLUTES">Glúteos</option>
                  <option value="CALVES">Pantorrillas</option>
                  <option value="NECK">Cuello</option>
                  <option value="LOWER_BACK">Zona Lumbar</option>
                  <option value="HIP">Caderas</option>
                  <option value="BALANCE">Ejercicios de Equilibrio</option>
                  <option value="MOBILITY">Movilidad</option>
                  <option value="STRETCHING">Estiramientos</option>
                  <option value="PROPRIOCEPTION">Propiocepción</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="mb-8 mt-8 px-6 py-3 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setShowForm(false)}
              >
                Crear y Asignar Ejercicio
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="mb-8 mt-8 px-6 py-3 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(({exercise, exerciseSessionId}) => (
            <div
              key={exerciseSessionId}
              className="bg-white p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {exercise?.title || "Sin título"}
              </h3>
              <p className="text-gray-600 mb-3">
                {exercise?.description || "Sin descripción"}
              </p>
              <p className="text-gray-500 mb-4">
                Área: {exercise?.area || "No especificada"}
              </p>
              <button
                onClick={() => handleUnassignExercise(exerciseSessionId)}
                className="mb-4 mt-4 px-6 py-3 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Eliminar de la Sesión</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
