import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export interface Exercise {
  id: number;
  title: string;
  description: string;
  area: string;
  physiotherapist: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExerciseFormData {
  title: string;
  description: string;
  area: string;
}

// Obtener todos los ejercicios del fisioterapeuta
export const fetchExercises = async (token: string): Promise<Exercise[]> => {
  try {
    const response = await axios.get(
      `${getApiBaseUrl()}/api/treatments/exercises/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener ejercicios:", error);
    throw error;
  }
};

// Crear un nuevo ejercicio
export const createExercise = async (
  token: string,
  exerciseData: ExerciseFormData
): Promise<Exercise> => {
  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/api/treatments/exercises/create/`,
      exerciseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear ejercicio:", error);
    throw error;
  }
};

// Eliminar un ejercicio
export const deleteExercise = async (
  token: string,
  exerciseId: number
): Promise<void> => {
  try {
    await axios.delete(
      `${getApiBaseUrl()}/api/treatments/exercises/${exerciseId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    throw error;
  }
};

// Asignar un ejercicio a una sesión
export const assignExerciseToSession = async (
  token: string,
  sessionId: number,
  exerciseId: number
): Promise<{ exercise_id: number; session_id: number }> => {
  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/assign-exercise/`,
      { exercise_id: exerciseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al asignar ejercicio a la sesión:", error);
    throw error;
  }
};

// Obtener ejercicios por área
export const fetchExercisesByArea = async (token: string): Promise<Exercise[]> => {
  try {
    const response = await axios.get(
      `${getApiBaseUrl()}/api/treatments/exercises/by-area/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener ejercicios por área:", error);
    throw error;
  }
};

// Buscar ejercicios por término
export const searchExercises = async (
  token: string,
  query: string
): Promise<Exercise[]> => {
  try {
    const response = await axios.get(
      `${getApiBaseUrl()}/api/treatments/exercises/search/?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al buscar ejercicios:", error);
    throw error;
  }
};
