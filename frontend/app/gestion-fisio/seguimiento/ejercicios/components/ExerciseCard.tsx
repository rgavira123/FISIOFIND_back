interface Exercise {
  id: number;
  name: string;
  description: string;
  repetitions: number;
  sets: number;
  duration: number;
  treatment_id: number;
  created_at: string;
  updated_at: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onDelete: (id: number) => void;
}

const ExerciseCard = ({ exercise, onDelete }: ExerciseCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{exercise.name}</div>
        <p className="text-gray-700 text-base mb-4">{exercise.description}</p>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{exercise.repetitions} repeticiones</span>
          <span>{exercise.sets} series</span>
          <span>{exercise.duration} segundos</span>
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
