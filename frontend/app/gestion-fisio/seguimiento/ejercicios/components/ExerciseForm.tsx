interface Exercise {
  name: string;
  description: string;
  repetitions: number;
  sets: number;
  duration: number;
}

interface ExerciseFormProps {
  exercise: Exercise;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ExerciseForm = ({ exercise, onChange, onSubmit }: ExerciseFormProps) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
      <h2 className="text-xl font-semibold mb-4">Nuevo Ejercicio</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nombre *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={exercise.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Descripción *
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={exercise.description}
            onChange={onChange}
            rows={4}
            required
          />
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="repetitions"
            >
              Repeticiones
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="repetitions"
              type="number"
              name="repetitions"
              min="1"
              value={exercise.repetitions}
              onChange={onChange}
            />
          </div>

          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="sets"
            >
              Series
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sets"
              type="number"
              name="sets"
              min="1"
              value={exercise.sets}
              onChange={onChange}
            />
          </div>

          <div className="w-full md:w-1/3 px-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="duration"
            >
              Duración (segundos)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="duration"
              type="number"
              name="duration"
              min="1"
              value={exercise.duration}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Guardar Ejercicio
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;
