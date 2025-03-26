import Image from "next/image";
import { useEffect, useState } from "react";

interface DynamicFormModalProps {
  event: any;
  onClose: () => void;
  onSubmit: (
    alternatives: Record<string, { start: string; end: string }[]>
  ) => void;
}

const addMinutesToTime = (start: string, duration: string): string => {
  const [hours, minutes] = start.split(":").map(Number);
  const date = new Date();
  const int_duration = Number(duration);
  date.setHours(hours);
  date.setMinutes(minutes + int_duration);
  return date.toTimeString().slice(0, 5);
};

const DynamicFormModal = ({
  event,
  onClose,
  onSubmit,
}: DynamicFormModalProps) => {
  // Estado: JSON con fechas como claves y arrays de tramos horarios
  const [alternatives, setAlternatives] = useState<
    Record<string, { start: string; end: string }[]>
  >({});

  useEffect(() => {
    // Inicializar el estado con una alternativa por defecto
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setAlternatives({
      [today]: [
        {
          start: "09:00",
          end: addMinutesToTime("09:00", event.service.duration),
        },
      ],
    });
  }, [event.service.duration]);

  const addAlternative = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setAlternatives((prev) => {
      const lastSlot = prev[today]?.[prev[today].length - 1];
      let start = lastSlot ? lastSlot.end : "09:00";
  
      // Redondear el tiempo de inicio al siguiente múltiplo de 30 minutos
      const [hours, minutes] = start.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
  
      if (date.getMinutes() > 0 && date.getMinutes() <= 30) {
        date.setMinutes(30);
      } else if (date.getMinutes() > 30) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
      }
  
      start = date.toTimeString().slice(0, 5);
      const end = addMinutesToTime(start, event.service.duration);
  
      return {
        ...prev,
        [today]: [
          ...(prev[today] || []),
          {
            start,
            end,
          },
        ],
      };
    });
  };
  
  const updateAlternative = (date: string, index: number, start: string) => {
    const updated = [...(alternatives[date] || [])];
    updated[index] = {
      start,
      end: addMinutesToTime(start, event.service.duration),
    };
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
    <div
      className="z-[9999] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-300 p-1 rounded-2xl shadow-2xl w-[400px] relative z-[9999]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-white text-xl font-bold text-center py-5 rounded-t-xl bg-[#d88c02]">
          Modificar fechas de la cita{" "}
        </h2>
        <div className="bg-gray-100 p-4 rounded-b-xl text-center">
          {" "}
          <div>
            {Object.entries(alternatives).map(([date, slots]) =>
              slots.map((slot, index) => (
                <div
                  key={`${date}-${index}`}
                  className="flex items-center mb-2"
                >
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
                        updated[date] = updated[date].filter(
                          (_, i) => i !== index
                        );
                        // Si la fecha original queda vacía, eliminarla
                        if (updated[date].length === 0) {
                          delete updated[date];
                        }
                        // Agregar el slot a la nueva fecha
                        updated[newDate] = [
                          ...(updated[newDate] || []),
                          movingSlot,
                        ];

                        return updated;
                      });
                    }}
                    className="border p-2 rounded-md"
                  />
                  <select
                    value={slot.start}
                    onChange={(e) =>
                      updateAlternative(date, index, e.target.value)
                    }
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

                  <span className="ml-2 text-gray-600 font-medium"> - &nbsp;{slot.end}</span>

                  {index>0 && <button
                    onClick={() => removeAlternative(date, index)}
                    className="ml-3 text-red-500 text-[20px] absolute right-6"
                  >
                    X
                  </button>}
                </div>
              ))
            )}
          </div>
          <hr className="mt-6 mb-2 border-gray-300" />

          <button
            onClick={addAlternative}
            className="p-2 my-4 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Añadir alternativa
          </button>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => onSubmit(alternatives)}
              className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Proponer fechas
            </button>
            <button
              onClick={onClose}
              className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;
