import { useState } from "react";

interface DynamicFormModalProps {
  event: any;
  onClose: () => void;
  onSubmit: (alternatives: Record<string, { start: string; end: string }[]>) => void;
}

const addMinutesToTime = (start: string, duration: string): string => {
  const [hours, minutes] = start.split(":").map(Number);
  const date = new Date();
  const int_duration = Number(duration);
  date.setHours(hours);
  date.setMinutes(minutes + int_duration);
  return date.toTimeString().slice(0, 5);
};

const DynamicFormModal = ({ event, onClose, onSubmit }: DynamicFormModalProps) => {
  // Estado: JSON con fechas como claves y arrays de tramos horarios
  const [alternatives, setAlternatives] = useState<Record<string, { start: string; end: string }[]>>({});

  const addAlternative = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setAlternatives((prev) => ({
      ...prev,
      [today]: [...(prev[today] || []), { start: "09:00", end: addMinutesToTime("09:00", event.service.duration) }]
    }));
  };

  const updateAlternative = (date: string, index: number, start: string) => {
    const updated = [...(alternatives[date] || [])];
    updated[index] = { start, end: addMinutesToTime(start, event.service.duration) };
    setAlternatives((prev) => ({ ...prev, [date]: updated }));
  };

  const removeAlternative = (date: string, index: number) => {
    const updated = (alternatives[date] || []).filter((_, i) => i !== index);
    setAlternatives((prev) => {
      const newState = { ...prev, [date]: updated };
      if (updated.length === 0) delete newState[date]; // Eliminar fecha si está vacía
      return newState;
    });
  };

  return (
    <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Modificar fechas de la cita</h2>

        {Object.entries(alternatives).map(([date, slots]) =>
          slots.map((slot, index) => (
            <div key={`${date}-${index}`} className="flex items-center mb-2">
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setAlternatives((prev) => {
                    const updated = { ...prev };
                    // Obtener la alternativa que se está moviendo
                    const movingSlot = updated[date]?.[index];
                    if (!movingSlot) return prev; // Si no hay nada que mover, salir
                    // Eliminar del array original
                    updated[date] = updated[date].filter((_, i) => i !== index);
                    // Si la fecha original queda vacía, eliminarla
                    if (updated[date].length === 0) {
                      delete updated[date];
                    }
                    // Agregar el slot a la nueva fecha
                    updated[newDate] = [...(updated[newDate] || []), movingSlot];

                    return updated;
                  });
                }}
                className="border p-2 rounded-md"
              />
              <select
                value={slot.start}
                onChange={(e) => updateAlternative(date, index, e.target.value)}
                className="border p-2 rounded-md ml-2"
              >
                {Array.from({ length: 48 }, (_, i) => {
                  const hour = String(Math.floor(i / 2)).padStart(2, "0");
                  const minutes = i % 2 === 0 ? "00" : "30";
                  return `${hour}:${minutes}`;
                }).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              <span className="ml-2 text-gray-600">{slot.end}</span>

              <button onClick={() => removeAlternative(date, index)} className="ml-2 text-red-500">
                X
              </button>
            </div>
          ))
        )}

        <button onClick={addAlternative} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Agregar alternativa
        </button>

        <div className="mt-4 flex justify-between">
          <button onClick={() => onSubmit(alternatives)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Enviar
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;
