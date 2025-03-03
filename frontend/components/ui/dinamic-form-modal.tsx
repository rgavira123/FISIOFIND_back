import { useState } from "react";

interface DynamicFormModalProps {
  onClose: () => void;
  onSubmit: (alternatives: string[]) => void;
}

const DynamicFormModal = ({ onClose, onSubmit }: DynamicFormModalProps) => {
  // Array de strings para almacenar las fechas alternativas (en formato ISO o datetime-local)
  const [alternatives, setAlternatives] = useState<string[]>([]);

  const addAlternative = () => {
    setAlternatives([...alternatives, ""]);
  };

  const updateAlternative = (index: number, value: string) => {
    const updated = [...alternatives];
    updated[index] = value;
    setAlternatives(updated);
  };

  const removeAlternative = (index: number) => {
    const updated = alternatives.filter((_, i) => i !== index);
    setAlternatives(updated);
  };

  const handleSubmit = () => {
    // Aquí puedes agregar validaciones adicionales si es necesario
    onSubmit(alternatives);
    onClose();
  };

  return (
    <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          Modificar fechas de la cita
        </h2>
        {alternatives.map((date, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => updateAlternative(index, e.target.value)}
              className="flex-1 border p-2 rounded-md"
            />
            <button
              onClick={() => removeAlternative(index)}
              className="ml-2 text-red-500"
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={addAlternative}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Agregar alternativa
        </button>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Enviar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;
