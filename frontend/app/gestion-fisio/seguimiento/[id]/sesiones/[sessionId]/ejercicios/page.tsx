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

interface Series {
  series_number: number;
  repetitions: number;
  weight?: number;
  time?: number;
  distance?: number;
}

// Add this interface for series data
interface SeriesData {
  id: number;
  series_number: number;
  repetitions: number;
  weight?: number;
  time?: number;
  distance?: number;
  exercise_session: number;
}

// Update the ExerciseSessionData interface to include series
interface ExerciseSessionData {
  exercise: Exercise;
  exerciseSessionId: number;
  series?: SeriesData[];
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

  const [series, setSeries] = useState<Series[]>([]);
  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const [currentExerciseSessionId, setCurrentExerciseSessionId] = useState<number | null>(null);

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

      const data = await response.json();
      setCurrentExerciseSessionId(data.id);
      setShowSeriesForm(true);
      setShowExistingExercises(false);
      
      // Load updated exercises after assigning a new one
      await loadSessionExercises();
    } catch (err) {
      setError("Error al asignar el ejercicio");
      console.log(err);
    }
  };

  const loadSeriesForExerciseSession = async (exerciseSessionId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se ha encontrado el token de autenticación");
        return [];
      }

      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/exercise-sessions/${exerciseSessionId}/series/`,
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

      return await response.json();
    } catch (err) {
      console.error("Error loading series:", err);
      return [];
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
        
        // Load series for this exercise session
        const seriesData = await loadSeriesForExerciseSession(exerciseSession.id);
        
        exercisesList.push({
          exercise: exerciseData,
          exerciseSessionId: exerciseSession.id,
          series: seriesData
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

  // Add a state to track the form step
  const [formStep, setFormStep] = useState(1);

  // Modify the handleCreateExercise function to handle the first step
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
      console.log("Exercise created:", createData);

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

      const assignData = await assignResponse.json();
      console.log("Exercise assigned:", assignData);
      
      // Set the exercise session ID and move to step 2
      setCurrentExerciseSessionId(assignData.id);
      setFormStep(2);
      
      // Add a default series
      if (series.length === 0) {
        handleAddSeries();
      }
    } catch (err) {
      setError("Error al crear y asignar el ejercicio");
      console.error("Error details:", err);
    }
  };

  // Add a function to handle form completion
  const handleCompleteForm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentExerciseSessionId) {
        setError("No se ha encontrado el token de autenticación o el ID de la sesión de ejercicio");
        return;
      }

      // Create series for the exercise session
      for (const serie of series) {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercise-sessions/${currentExerciseSessionId}/series/create/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serie),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Reset form state
      setSeries([]);
      setFormStep(1);
      setShowForm(false);
      setCurrentExerciseSessionId(null);
      
      // Reload exercises to show the newly created and assigned exercise
      await loadSessionExercises();
    } catch (err) {
      setError("Error al completar el formulario");
      console.error("Error details:", err);
    }
  };

  // Add a function to handle form cancellation
  const handleCancelForm = () => {
    setFormStep(1);
    setShowForm(false);
    setSeries([]);
    setCurrentExerciseSessionId(null);
  };

  const handleCreateSeries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentExerciseSessionId) {
        setError("No se ha encontrado el token de autenticación o el ID de la sesión de ejercicio");
        return;
      }

      for (const serie of series) {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/exercise-sessions/${currentExerciseSessionId}/series/create/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serie),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      setSeries([]);
      setShowSeriesForm(false);
      setCurrentExerciseSessionId(null);
      loadSessionExercises();
    } catch (err) {
      setError("Error al crear las series");
      console.log(err);
    }
  };

  const handleAddSeries = () => {
    const newSeries: Series = {
      series_number: series.length + 1,
      repetitions: 0,
      weight: undefined,
      time: undefined,
      distance: undefined,
    };
    setSeries([...series, newSeries]);
  };

  const handleUpdateSeries = (index: number, field: keyof Series, value: number) => {
    const updatedSeries = [...series];
    updatedSeries[index] = { ...updatedSeries[index], [field]: value };
    setSeries(updatedSeries);
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
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
            {formStep === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Ejercicio</h2>
                <form onSubmit={handleCreateExercise} className="grid grid-cols-1 gap-6">
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
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
                    >
                      Continuar
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-6 py-3 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurar Series del Ejercicio</h2>
                <div className="space-y-6">
                  {series.map((serie, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Serie {serie.series_number}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Repeticiones
                          </label>
                          <input
                            type="number"
                            value={serie.repetitions}
                            onChange={(e) => handleUpdateSeries(index, 'repetitions', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso (kg)
                          </label>
                          <input
                            type="number"
                            value={serie.weight || ''}
                            onChange={(e) => handleUpdateSeries(index, 'weight', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiempo (segundos)
                          </label>
                          <input
                            type="number"
                            value={serie.time || ''}
                            onChange={(e) => handleUpdateSeries(index, 'time', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Distancia (metros)
                          </label>
                          <input
                            type="number"
                            value={serie.distance || ''}
                            onChange={(e) => handleUpdateSeries(index, 'distance', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handleAddSeries}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                  >
                    Añadir Serie
                  </button>
                  <div className="space-x-4">
                    <button
                      onClick={handleCancelForm}
                      className="px-4 py-2 bg-red-400 text-white rounded-xl hover:bg-red-500"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCompleteForm}
                      className="px-4 py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab8ad]"
                    >
                      Guardar Series
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(({exercise, exerciseSessionId, series}) => (
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
              
              {/* Display series information */}
              {series && series.length > 0 ? (
                <div className="mt-4 mb-4">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Series:</h4>
                  <div className="space-y-3">
                    {series.map((serie) => (
                      <div key={serie.id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">Serie {serie.series_number}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                          <p>Repeticiones: {serie.repetitions}</p>
                          {serie.weight && <p>Peso: {serie.weight} kg</p>}
                          {serie.time && <p>Tiempo: {serie.time} seg</p>}
                          {serie.distance && <p>Distancia: {serie.distance} m</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic mb-4">No hay series configuradas</p>
              )}
              
              <button
                onClick={() => handleUnassignExercise(exerciseSessionId)}
                className="mb-4 mt-4 px-6 py-3 bg-red-400 text-white font-medium rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Eliminar de la Sesión</span>
              </button>
            </div>
          ))}
        </div>

        {showSeriesForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurar Series del Ejercicio</h2>
              
              <div className="space-y-6">
                {series.map((serie, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Serie {serie.series_number}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repeticiones
                        </label>
                        <input
                          type="number"
                          value={serie.repetitions}
                          onChange={(e) => handleUpdateSeries(index, 'repetitions', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          value={serie.weight || ''}
                          onChange={(e) => handleUpdateSeries(index, 'weight', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiempo (segundos)
                        </label>
                        <input
                          type="number"
                          value={serie.time || ''}
                          onChange={(e) => handleUpdateSeries(index, 'time', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distancia (metros)
                        </label>
                        <input
                          type="number"
                          value={serie.distance || ''}
                          onChange={(e) => handleUpdateSeries(index, 'distance', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleAddSeries}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                >
                  Añadir Serie
                </button>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      setSeries([]);
                      setShowSeriesForm(false);
                      setCurrentExerciseSessionId(null);
                    }}
                    className="px-4 py-2 bg-red-400 text-white rounded-xl hover:bg-red-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateSeries}
                    className="px-4 py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab8ad]"
                  >
                    Guardar Series
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExercisesPage;
