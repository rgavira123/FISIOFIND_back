"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExerciseCard from "./components/ExerciseCard";
import ExerciseForm from "./components/ExerciseForm";
import {
  Exercise,
  fetchExercises,
  createExercise,
  deleteExercise,
} from "./utils/exercise-api";

// interface ExerciseSession {
//   id: number;
//   exercise: Exercise;
//   session: number;
//   repetitions?: number;
//   sets?: number;
//   duration?: number; // en segundos
//   treatment_id?: number;
//   created_at?: string;
//   updated_at?: string;
// }

const EjerciciosPage = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treatmentId, setTreatmentId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Formulario para nuevo ejercicio
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    area: "",
  });

  // Estado para mostrar/ocultar el formulario
  const [showForm, setShowForm] = useState(false);

  // Estado para mostrar/ocultar el selector de ejercicios existentes
  const [showExistingExercises, setShowExistingExercises] = useState(false);

  // Estado para almacenar los ejercicios existentes del fisioterapeuta
  const [existingExercises, setExistingExercises] = useState<Exercise[]>([]);

  // Estado para almacenar los ejercicios filtrados
  const [filteredExistingExercises, setFilteredExistingExercises] = useState<
    Exercise[]
  >([]);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Obtener el ID del tratamiento de la URL o de localStorage
      const params = new URLSearchParams(window.location.search);
      const id = params.get("treatment_id");
      setTreatmentId(id);

      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      console.log(token);

      // Cargar ejercicios si tenemos un ID de tratamiento
      if (id) {
        loadExercises(id);
      } else {
        setLoading(false);
        setError("No se ha especificado un tratamiento");
      }
    }
  }, [isClient, token]);

  const loadExercises = async (treatmentId: string) => {
    try {
      setLoading(true);

      // Obtener el token de autenticación
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setError("No se ha encontrado el token de autenticación");
        setLoading(false);
        return;
      }

      // Obtener todos los ejercicios del fisioterapeuta para la biblioteca personal
      const exercisesData = await fetchExercises(storedToken);
      setExistingExercises(exercisesData);
      setFilteredExistingExercises(exercisesData);

      // Por ahora, no tenemos ejercicios asignados al tratamiento
      // Cuando se implemente ese endpoint, se actualizará esta parte
      setExercises([]);
    } catch (err) {
      console.error("Error al cargar ejercicios:", err);
      setError(
        "No se pudieron cargar los ejercicios. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (treatmentId) {
      router.push(`/gestion-fisio/seguimiento/${treatmentId}`);
    } else {
      router.push("/gestion-fisio/seguimiento");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]:
        name === "repetitions" || name === "sets" || name === "duration"
          ? parseInt(value) || 0
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!newExercise.title || !newExercise.description || !newExercise.area) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    try {
      // Obtener el token de autenticación
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      // Crear un nuevo ejercicio utilizando la función de la API
      const createdExercise = await createExercise(storedToken, newExercise);

      // Actualizar la lista de ejercicios existentes
      setExistingExercises([...existingExercises, createdExercise]);
      setFilteredExistingExercises([
        ...filteredExistingExercises,
        createdExercise,
      ]);

      // Resetear el formulario
      setNewExercise({
        title: "",
        description: "",
        area: "",
      });

      setShowForm(false);
      setError(null);
    } catch (error) {
      console.error("Error al crear el ejercicio:", error);
      setError("Error al crear el ejercicio. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteExercise = async (id: number) => {
    try {
      // Obtener el token de autenticación
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      // Eliminar el ejercicio utilizando la función de la API
      await deleteExercise(storedToken, id);

      // Actualizar la lista de ejercicios
      setExercises(exercises.filter((exercise) => exercise.id !== id));
      setExistingExercises(
        existingExercises.filter((exercise) => exercise.id !== id)
      );
      setFilteredExistingExercises(
        filteredExistingExercises.filter((exercise) => exercise.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el ejercicio:", error);
      setError(
        "Error al eliminar el ejercicio. Por favor, inténtalo de nuevo."
      );
    }
  };

  // Función para filtrar ejercicios existentes
  const handleSearchExistingExercises = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredExistingExercises(existingExercises);
    } else {
      const filtered = existingExercises.filter(
        (exercise) =>
          exercise.title.toLowerCase().includes(term) ||
          exercise.description.toLowerCase().includes(term)
      );
      setFilteredExistingExercises(filtered);
    }
  };

  // Función para seleccionar un ejercicio existente
  const handleSelectExistingExercise = async (exercise: Exercise) => {
    try {
      // Obtener el token de autenticación
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setError("No se ha encontrado el token de autenticación");
        return;
      }

      // Si tenemos un ID de tratamiento y una sesión, asignar el ejercicio a la sesión
      if (treatmentId) {
        // En un entorno real, aquí enviaríamos la petición al backend para asignar el ejercicio a la sesión
        // Por ejemplo:
        // const response = await axios.post(
        //   `${getApiBaseUrl()}/api/treatments/${treatmentId}/sessions/${sessionId}/assign-exercise/`,
        //   { exercise_id: exercise.id },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${storedToken}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // Por ahora, simplemente añadimos el ejercicio a la lista local
        setExercises([...exercises, exercise]);
        setShowExistingExercises(false);
      }
    } catch (error) {
      console.error("Error al asignar el ejercicio:", error);
      setError("Error al asignar el ejercicio. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleGoBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold">Gestión de Ejercicios</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowExistingExercises(false);
              setShowForm(!showForm);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
          >
            {showForm ? "Cancelar" : "Nuevo Ejercicio"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setShowExistingExercises(!showExistingExercises);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
          >
            {showExistingExercises ? "Cancelar" : "Seleccionar Existente"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <ExerciseForm
          exercise={newExercise}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      )}

      {showExistingExercises && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Seleccionar Ejercicio Existente
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar ejercicios..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={searchTerm}
              onChange={handleSearchExistingExercises}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredExistingExercises.length > 0 ? (
              filteredExistingExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectExistingExercise(exercise)}
                >
                  <h3 className="font-bold text-lg">{exercise.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {exercise.description.substring(0, 100)}...
                  </p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {exercise.area}
                  </span>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-500 py-4">
                No se encontraron ejercicios. Intenta con otra búsqueda o crea
                un nuevo ejercicio.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onDelete={handleDeleteExercise}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">
              No hay ejercicios asignados a este tratamiento.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Añadir el primer ejercicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EjerciciosPage;
