"use client";

import { useState, useEffect, useCallback } from "react";
import { getApiBaseUrl } from "@/utils/api";

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

const ExercisesPage = ({ params }: { params: { id: string; sessionId: string } }) => {
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    area: "UPPER_BODY" as AreaChoice,
  });

  const loadSessionExercises = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${params.sessionId}/exercises/`,
        {
          method: 'GET',
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
      
      const exercisesList: Exercise[] = [];
      for (const exerciseSession of data) {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercises/${exerciseSession.exercise}`,
          {
            method: 'GET',
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
        exercisesList.push(exerciseData);
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
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExercise)
        }
      );

      if (!createResponse.ok) {
        throw new Error(`HTTP error! status: ${createResponse.status}`);
      }

      const createData = await createResponse.json();

      // Asignar el ejercicio creado a la sesión
      const assignResponse = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${params.sessionId}/assign-exercise/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercise: createData.id })
        }
      );

      if (!assignResponse.ok) {
        throw new Error(`HTTP error! status: ${assignResponse.status}`);
      }

      setNewExercise({ title: "", description: "", area: "UPPER_BODY" as AreaChoice });
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
          method: 'DELETE',
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ejercicios de la Sesión</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showForm ? "Cancelar" : "Crear Nuevo Ejercicio"}
      </button>

      {showForm && (
        <form onSubmit={handleCreateExercise} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={newExercise.title}
                onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={newExercise.description}
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Área</label>
              <select
                value={newExercise.area}
                onChange={(e) => setNewExercise({ ...newExercise, area: e.target.value as AreaChoice })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Crear y Asignar Ejercicio
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">
              {exercise?.title || 'Sin título'}
            </h3>
            <p className="text-gray-600 mb-2">
              {exercise?.description || 'Sin descripción'}
            </p>
            <p className="text-gray-500 mb-4">
              Área: {exercise?.area || 'No especificada'}
            </p>
            <button
              onClick={() => handleUnassignExercise(exercise.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Eliminar de la Sesión
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;