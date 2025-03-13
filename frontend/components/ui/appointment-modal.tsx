import React from "react";
import axios from "axios";
import { CalendarProps } from "@/lib/definitions";
import Image from "next/image";

interface AppointmentModalProps {
  selectedEvent: CalendarProps | null;
  setSelectedEvent: (event: CalendarProps | null) => void;
  setEditionMode: (mode: boolean) => void;
}

const handleAlternativesSubmit = (
  selectedEvent: CalendarProps | null,
  alternatives: Record<string, { start: string; end: string }[]>
) => {
  if (!selectedEvent) return;
  const token = localStorage.getItem("token")

  axios
    .patch(`http://localhost:8000/api/appointment/${selectedEvent.id}/`, {
      title: selectedEvent.title,
      description: selectedEvent.description,
      start_time: selectedEvent.start,
      end_time: selectedEvent.end,
      status: "pending",
      alternatives: alternatives,
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    })
    .then((response) => {
      alert("La cita se actualizó correctamente.");
    })
    .catch((error) => {
      alert("Hubo un problema con la conexión. Intenta nuevamente.");
    });
};

const deleteEvent = (selectedEvent: CalendarProps | null) => {
  if (!selectedEvent) return;

  axios
    .delete(`http://localhost:8000/api/appointment/${selectedEvent.id}/`)
    .then((response) => {
      alert("La cita se eliminó correctamente.");
    })
    .catch((error) => {
      alert("Hubo un problema con la conexión. Intenta nuevamente.");
    });
};

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  selectedEvent,
  setSelectedEvent,
  setEditionMode,
}) => {
  if (!selectedEvent) return null;

  return (
    <div
      className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => setSelectedEvent(null)}
    >
      <div
        className="bg-gray-300 p-1 rounded-2xl shadow-2xl w-[400px] relative z-50"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-gray-300 p-1 rounded-full"
          onClick={() => setSelectedEvent(null)}
        >
          <Image src="/static/close.svg" alt="Cerrar" width={18} height={18} />
        </button>{" "}
        <h2 className="text-white text-xl font-bold text-center py-5 rounded-t-xl bg-[#05668D]">
          {selectedEvent.title}
        </h2>
        <div className="bg-gray-100 p-4 rounded-b-xl">
          <p className="text-gray-600 mt-2">
            <strong>Inicio:</strong>{" "}
            {new Date(selectedEvent.start).toLocaleString()}
          </p>
          {selectedEvent.end && (
            <p className="text-gray-600">
              <strong>Fin:</strong>{" "}
              {new Date(selectedEvent.end).toLocaleString()}
            </p>
          )}
          <p className="mt-2">{selectedEvent.description}</p>
          {selectedEvent.status == "booked" && (
            <div
              className="flex flex-row mt-4"
              style={{ justifyContent: "space-between" }}
            >
              <button
                className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                onClick={() => setEditionMode(true)}
              >
                Modificar cita
              </button>
              <button
                className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                onClick={() => deleteEvent(selectedEvent)}
              >
                Cancelar cita
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AppointmentModal, handleAlternativesSubmit, deleteEvent };
