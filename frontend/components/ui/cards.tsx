import { useState } from "react";
import { CalendarProps } from "@/lib/definitions";
import { AppointmentModal, handleAlternativesSubmit } from "./appointment-modal";
import DynamicFormModal from "./dinamic-form-modal";

const Cards = ({
  events,
  onCardHover,
}: {
  events: CalendarProps[];
  onCardHover: (eventId: string | null) => void;
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarProps | null>(
    null
  );
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
        />
      )}
      {/* MODAL */}
      {editionMode && (
        <DynamicFormModal
          event={selectedEvent}
          onClose={() => setEditionMode(false)}
          onSubmit={(alternatives) =>
            handleAlternativesSubmit(selectedEvent, alternatives)
          }
        />
      )}
    </>
  );
};

export default Cards;