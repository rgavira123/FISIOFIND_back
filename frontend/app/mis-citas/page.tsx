'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';

interface APIResponse {
  message: string;
  status: string;
}

const initialEvents = [
  { title: 'Reunión de equipo', start: '2025-03-01T10:00:00', end: '2025-03-01T11:30:00' },
  { title: 'Patata', allDay: true, start: '2025-03-01' },
  { title: 'Almuerzo con cliente', start: '2025-03-02T12:00:00', end: '2025-03-02T13:30:00' },
];

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [view, setView] = useState<"calendar" | "cards">("calendar"); // Estado para cambiar vista
  const [events, setEvents] = useState(initialEvents);
  
  // Estado para el nuevo evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: false
  });

  useEffect(() => {
    axios.get("http://localhost:8000/app_user/prueba/")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Función para añadir eventos
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start) {
      alert("El título y la fecha de inicio son obligatorios.");
      return;
    }

    const formattedEvent = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end || null,
      allDay: newEvent.allDay
    };

    setEvents([...events, formattedEvent]);
    setNewEvent({ title: "", start: "", end: "", allDay: false }); // Reset form
  };

  return (
    <>
      <p className="text-xl font-bold text-red-500 text-center">Voy a hacer la s palabra</p>

      {/* Botón para cambiar entre FullCalendar y vista en Cards */}
      <div className="flex justify-center my-4">
        <button 
          onClick={() => setView(view === "calendar" ? "cards" : "calendar")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          {view === "calendar" ? "Ver en Tarjetas" : "Ver Calendario"}
        </button>
      </div>

      {/* Formulario para agregar eventos */}
      <div className="max-w-lg mx-auto bg-white shadow-md p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-3">Añadir Evento</h2>
        <form onSubmit={addEvent} className="space-y-2">
          <input 
            type="text" 
            placeholder="Título del evento" 
            value={newEvent.title} 
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
            className="w-full p-2 border rounded-md"
            required
          />
          <input 
            type="datetime-local" 
            value={newEvent.start} 
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} 
            className="w-full p-2 border rounded-md"
            required
          />
          <input 
            type="datetime-local" 
            value={newEvent.end} 
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} 
            className="w-full p-2 border rounded-md"
          />
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={newEvent.allDay} 
              onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked, end: "" })} 
            />
            <span>Evento de todo el día</span>
          </label>
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Añadir Evento
          </button>
        </form>
      </div>

      {/* Vista del Calendario */}
      {view === "calendar" && (
        <div className="w-[1000px] h-[800px] mx-auto mt-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            locale={esLocale}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            eventContent={(eventInfo) => (
              <div className="bg-blue-500 text-white p-2 rounded-md w-full h-full flex items-center justify-center">
                {eventInfo.event.title}
              </div>
            )}
            height="100%"
          />
        </div>
      )}

      {/* Vista en Cards */}
      {view === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {events.map((event, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
              <p className="text-gray-600">{new Date(event.start).toLocaleString()}</p>
              {event.end && <p className="text-gray-500">Hasta {new Date(event.end).toLocaleString()}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Mostrar datos de API si existen */}
      {data && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Mensaje: {data.message}</p>
          <p className="text-gray-600">Estado: {data.status}</p>
        </div>
      )}
    </>
  );
}
