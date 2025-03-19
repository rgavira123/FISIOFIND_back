"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExerciseCard from "./components/ExerciseCard";
import ExerciseForm from "./components/ExerciseForm";

interface Exercise {
  id: number;
  name: string;
  description: string;
  repetitions: number;
  sets: number;
  duration: number; // en segundos
  treatment_id: number;
  created_at: string;
  updated_at: string;
}

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
    name: "",
    description: "",
    repetitions: 10,
    sets: 3,
    duration: 30,
  });

  // Estado para mostrar/ocultar el formulario
  const [showForm, setShowForm] = useState(false);

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
        fetchExercises(id);
      } else {
        setLoading(false);
        setError("No se ha especificado un tratamiento");
      }
    }
  }, [isClient]);

  const fetchExercises = async (treatmentId: string) => {
    try {
      setLoading(true);

      // En un entorno real, aquí haríamos la petición al backend
      // Por ahora, usaremos datos de ejemplo

      // Simulación de datos de ejemplo
      const mockExercises: Exercise[] = [
        {
          id: 1,
          name: "Estiramiento de isquiotibiales",
          description:
            "Sentado con las piernas extendidas, intenta tocar los dedos de los pies",
          repetitions: 10,
          sets: 3,
          duration: 30,
          treatment_id: parseInt(treatmentId),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Elevación de pierna",
          description:
            "Acostado boca arriba, eleva una pierna manteniendo la rodilla recta",
          repetitions: 15,
          sets: 2,
          duration: 20,
          treatment_id: parseInt(treatmentId),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setExercises(mockExercises);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!newExercise.name || !newExercise.description) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    // En un entorno real, aquí enviaríamos los datos al backend
    // Por ahora, simularemos la creación

    const newExerciseWithId: Exercise = {
      ...newExercise,
      id: exercises.length + 1,
      treatment_id: treatmentId ? parseInt(treatmentId) : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setExercises([...exercises, newExerciseWithId]);

    // Resetear el formulario
    setNewExercise({
      name: "",
      description: "",
      repetitions: 10,
      sets: 3,
      duration: 30,
    });

    setShowForm(false);
    setError(null);
  };

  const handleDeleteExercise = (id: number) => {
    // En un entorno real, aquí enviaríamos la petición de eliminación al backend
    // Por ahora, simplemente filtramos el ejercicio del estado
    setExercises(exercises.filter((exercise) => exercise.id !== id));
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
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          {showForm ? "Cancelar" : "Nuevo Ejercicio"}
        </button>
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
