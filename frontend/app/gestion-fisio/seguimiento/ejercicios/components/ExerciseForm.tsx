interface Exercise {
  title: string;
  description: string;
  area: string;
}

interface ExerciseFormProps {
  exercise: Exercise;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ExerciseForm = ({ exercise, onChange, onSubmit }: ExerciseFormProps) => {
  const AREA_CHOICES = [
    { value: "UPPER_BODY", label: "Parte Superior del Cuerpo" },
    { value: "LOWER_BODY", label: "Parte Inferior del Cuerpo" },
    { value: "CORE", label: "Zona Media/Core" },
    { value: "FULL_BODY", label: "Cuerpo Completo" },
    { value: "SHOULDER", label: "Hombros" },
    { value: "ARM", label: "Brazos (Bíceps, Tríceps)" },
    { value: "CHEST", label: "Pecho" },
    { value: "BACK", label: "Espalda" },
    { value: "QUADRICEPS", label: "Cuádriceps" },
    { value: "HAMSTRINGS", label: "Isquiotibiales" },
    { value: "GLUTES", label: "Glúteos" },
    { value: "CALVES", label: "Pantorrillas" },
    { value: "NECK", label: "Cuello" },
    { value: "LOWER_BACK", label: "Zona Lumbar" },
    { value: "HIP", label: "Caderas" },
    { value: "BALANCE", label: "Ejercicios de Equilibrio" },
    { value: "MOBILITY", label: "Movilidad" },
    { value: "STRETCHING", label: "Estiramientos" },
    { value: "PROPRIOCEPTION", label: "Propiocepción" },
  ];

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
      <h2 className="text-xl font-semibold mb-4">Nuevo Ejercicio</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Título *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            value={exercise.title}
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

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="area"
          >
            Área del cuerpo *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="area"
            name="area"
            value={exercise.area}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
            required
          >
            <option value="">Selecciona un área</option>
            {AREA_CHOICES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-end">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 w-full">
            <p className="text-sm">
              <span className="font-bold">Nota:</span> El ejercicio que estás
              creando se guardará en tu biblioteca personal y podrás
              reutilizarlo con otros pacientes.
            </p>
          </div>
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
