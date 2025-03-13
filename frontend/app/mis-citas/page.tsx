"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Cards from "@/components/ui/cards";
import Calendar from "@/components/ui/calendar";

interface APIResponse {
  message: string;
  status: string;
}

const initialEvents = [
  {
    title: "Reunión de equipo",
    start: "2025-03-01T10:00:00",
    end: "2025-03-01T11:30:00",
    description: "Reunión semanal de equipo",
  },
  { title: "Patata", allDay: true, start: "2025-03-01", description: "Patata" },
  {
    title: "Almuerzo con cliente",
    start: "2025-03-02T12:00:00",
    end: "2025-03-02T13:30:00",
    description: "Almuerzo con el cliente para discutir el proyecto",
  },
];

export default function Home() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [view, setView] = useState<"calendar" | "cards">("calendar"); // Estado para cambiar vista
  const [events, setEvents] = useState([]);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null); // Estado para el hover de tarjetas
  const [currentRole, setCurrentRole] = useState("");

  // Estado para el nuevo evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    allDay: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtén el JWT desde localStorage (o desde donde lo tengas almacenado)

    axios.get("http://localhost:8000/api/app_user/check-role/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(response => {
        setCurrentRole(response.data.user_role);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });

    if (currentRole == "physiotherapist") {
      axios.get("http://localhost:8000/api/appointment/physio/list", {
        headers: {
          Authorization: `Bearer ${token}`, // Envía el JWT en la cabecera de la petición
        },
      })
        .then(response => {
          const transformedEvents = response.data.results.map((event: any) => ({
            id: event.id,
            title: event.service.type + "-" + event.patient || "Sin título",
            start: event.start_time,  // Cambio de start_time a start
            end: event.end_time,      // Cambio de end_time a end
            description: event.description,
            allDay: event.allDay || false,
            status: event.status,
            service: {
              type: event.service.type,
              duration: event.service.duration,
            },
            alternatives: event.alternatives,
          }));
          console.log("citas", response.data);
          setEvents(transformedEvents);
        })
        .catch(error => {
          console.log("Error fetching data:", error);
        });
    } else if (currentRole == "patient") {
      axios.get("http://localhost:8000/api/appointment/patient/list", {
        headers: {
          Authorization: `Bearer ${token}`, // Envía el JWT en la cabecera de la petición
        },
      })
        .then(response => {
          const transformedEvents = response.data.map((event: any) => ({
            id: event.id,
            title: event.service.type + "-" + event.patient || "Sin título",
            start: event.start_time,  // Cambio de start_time a start
            end: event.end_time,      // Cambio de end_time a end
            description: event.description,
            allDay: event.allDay || false,
            status: event.status,
            service: {
              type: event.service.type,
              duration: event.service.duration,
            },
            alternatives: event.alternatives,
          }));
          console.log("citas", response.data);
          setEvents(transformedEvents);
        })
        .catch(error => {
          console.log("Error fetching data:", error);
        });
    }
  }, [currentRole]);

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
      allDay: newEvent.allDay,
    };

    setEvents([...events, formattedEvent]);
    setNewEvent({ title: "", start: "", end: "", allDay: false }); // Reset form
  };

  const handleCardHover = (eventId: string | null) => {
    setHoveredEventId(eventId);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {/* Vista en Cards */}
        <Cards events={events} onCardHover={handleCardHover} />

        <div style={{ borderLeft: "1px solid #000", minHeight: "100%" }}></div>

        {/* Vista del Calendario */}
        <Calendar events={events} currentRole={currentRole} hoveredEventId={hoveredEventId} />
      </div>

      {data && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Mensaje: {data.message}</p>
          <p className="text-gray-600">Estado: {data.status}</p>
        </div>
      )}
    </>
  );
}
