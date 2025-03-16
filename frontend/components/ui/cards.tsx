import { useState } from "react";
import { CalendarProps } from "@/lib/definitions";
import { AppointmentModal} from "./appointment-modal";
import DynamicFormModal from "./dinamic-form-modal";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const Cards = ({
  events,
  onCardHover,
  isClient,
  token,
  currentRole
}: {
  events: CalendarProps[];
  onCardHover: (eventId: string | null) => void;
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(
    null
  );

  const handleAlternativesSubmit = (
    alternatives: Record<string, { start: string; end: string }[]>
  ) => {
    console.log("Fechas alternativas enviadas:", alternatives);
    // Aquí podrías hacer una petición al backend para actualizar la cita,
    // por ejemplo, usando axios.post con el array de alternativas
    if (isClient) {
      if (token) {
        axios
          .put(`${getApiBaseUrl()}/api/appointment/update/${selectedEvent?.id}/`, {
            start_time: selectedEvent?.start,
            end_time: selectedEvent?.end,
            status: "pending",
            alternatives: alternatives,
          }, {
            headers: {
              Authorization: "Bearer " + token,
            }
          })
          .then((response) => {
            // Si la respuesta fue exitosa
            alert("La cita se actualizó correctamente.");
            console.log("Cita actualizada correctamente", response);
            setEditionMode(false);
            setSelectedEvent(null);
            window.location.reload();
          })
          .catch((error) => {
            // Si hubo un error en la solicitud
            console.error("Error en la actualización de la cita:", error);
            alert("Hubo un problema con la conexión. Intenta nuevamente.");
          });
      }
    }
  };
  const [editionMode, setEditionMode] = useState(false);
  return (
    <>
      <div className="bg-slate-100 flex flex-col h-auto w-full lg:w-1/3 gap-4 p-4 pt-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-blue shadow-lg rounded-lg p-4 mb-4 border-l-4 border-blue-500 cursor-pointer overflow-y-auto"
            onMouseEnter={() => onCardHover(event.title)} // Aquí detectamos el hover
            onMouseLeave={() => onCardHover(null)} // Limpiamos el hover cuando el mouse sale
            onClick={() => setSelectedEvent(event)} // Seleccionamos el evento al hacer clic
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {event.title}
            </h3>
            <p className="text-gray-600">
              {new Date(event.start).toLocaleString()}
            </p>
            {event.end && (
              <p className="text-gray-500">
                Hasta {new Date(event.end).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <AppointmentModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setEditionMode={setEditionMode}
          token={token}
          isClient={isClient}
          currentRole={currentRole}
        />
      )}
      {/* MODAL */}
      {editionMode && (
        <DynamicFormModal
          event={selectedEvent}
          onClose={() => setEditionMode(false)}
          onSubmit={handleAlternativesSubmit}
        />
      )}
    </>
  );
};

export default Cards;