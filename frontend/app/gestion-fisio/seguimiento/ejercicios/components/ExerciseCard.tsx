interface Exercise {
  id: number;
  title: string;
  description: string;
  area: string;
  physiotherapist: number;
  created_at?: string;
  updated_at?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onDelete: (id: number) => void;
}

const ExerciseCard = ({ exercise, onDelete }: ExerciseCardProps) => {
  // Función para obtener la etiqueta del área a partir del valor
  const getAreaLabel = (areaValue: string) => {
    const areaMap: { [key: string]: string } = {
      UPPER_BODY: "Parte Superior del Cuerpo",
      LOWER_BODY: "Parte Inferior del Cuerpo",
      CORE: "Zona Media/Core",
      FULL_BODY: "Cuerpo Completo",
      SHOULDER: "Hombros",
      ARM: "Brazos (Bíceps, Tríceps)",
      CHEST: "Pecho",
      BACK: "Espalda",
      QUADRICEPS: "Cuádriceps",
      HAMSTRINGS: "Isquiotibiales",
      GLUTES: "Glúteos",
      CALVES: "Pantorrillas",
      NECK: "Cuello",
      LOWER_BACK: "Zona Lumbar",
      HIP: "Caderas",
      BALANCE: "Ejercicios de Equilibrio",
      MOBILITY: "Movilidad",
      STRETCHING: "Estiramientos",
      PROPRIOCEPTION: "Propiocepción",
    };
    return areaMap[areaValue] || areaValue;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{exercise.title}</div>
        <p className="text-gray-700 text-base mb-4">{exercise.description}</p>

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            {getAreaLabel(exercise.area)}
          </span>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onDelete(exercise.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
