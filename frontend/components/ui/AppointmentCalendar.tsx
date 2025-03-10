"use client";
import React, { useState } from "react";
import FullCalendar, { DatesSetArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Ejemplo de schedule; normalmente lo obtendrías de una API u otro origen
const scheduleData = {
  schedule: {
    exceptions: {
      "2025-03-15": [
        { start: "10:00", end: "12:00" },
        { start: "14:00", end: "16:00" },
      ],
    },
    appointments: [
      {
        start_time: "2025-06-15T10:00:00",
        end_time: "2025-06-15T10:45:00",
        status: "booked",
      },
    ],
    weekly_schedule: {
      monday: [{ start: "10:00", end: "14:00" }],
      tuesday: [{ start: "10:00", end: "15:00" }],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [{ start: "09:00", end: "15:00" }],
      sunday: [],
    },
  },
};

// Funciones auxiliares para trabajar con tiempos
const timeStrToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTimeStr = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// Resta los intervalos ocupados de un intervalo libre
const subtractInterval = (
  interval: { start: string; end: string },
  appointments: { start: string; end: string }[]
) => {
  let freeIntervals: { start: number; end: number }[] = [
    {
      start: timeStrToMinutes(interval.start),
      end: timeStrToMinutes(interval.end),
    },
  ];

  appointments.forEach((app) => {
    const appStart = timeStrToMinutes(app.start);
    const appEnd = timeStrToMinutes(app.end);
    freeIntervals = freeIntervals.flatMap((free) => {
      if (appEnd <= free.start || appStart >= free.end) {
        return [free];
      }
      const intervals = [];
      if (appStart > free.start) {
        intervals.push({ start: free.start, end: appStart });
      }
      if (appEnd < free.end) {
        intervals.push({ start: appEnd, end: free.end });
      }
      return intervals;
    });
  });

  return freeIntervals.map((free) => ({
    start: minutesToTimeStr(free.start),
    end: minutesToTimeStr(free.end),
  }));
};

// Retorna los slots disponibles para una fecha y duración de servicio
export const getAvailableSlots = (dateStr: string, serviceDuration: number): string[] => {
  const dayOfWeek = new Date(dateStr)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const intervals =
    scheduleData.schedule.exceptions[dateStr] ||
    scheduleData.schedule.weekly_schedule[dayOfWeek] ||
    [];

  const appointmentsForDate = scheduleData.schedule.appointments
    .filter((app) => app.start_time.startsWith(dateStr))
    .map((app) => {
      const startTime = new Date(app.start_time).toTimeString().slice(0, 5);
      const endTime = new Date(app.end_time).toTimeString().slice(0, 5);
      return { start: startTime, end: endTime };
    });

  let freeIntervals: { start: string; end: string }[] = [];
  intervals.forEach((interval) => {
    const free = subtractInterval(interval, appointmentsForDate);
    freeIntervals = freeIntervals.concat(free);
  });

  const availableSlots: string[] = [];
  freeIntervals.forEach((interval) => {
    let startMin = timeStrToMinutes(interval.start);
    const endMin = timeStrToMinutes(interval.end);
    while (startMin + serviceDuration <= endMin) {
      availableSlots.push(minutesToTimeStr(startMin));
      startMin += 15;
    }
  });

  return availableSlots;
};

interface AppointmentCalendarProps {
  serviceDuration: number;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ serviceDuration }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [backgroundEvents, setBackgroundEvents] = useState<any[]>([]);

  // Cuando se hace clic en un día: mostrar slots disponibles
  const handleDateClick = (arg: any) => {
    const dateStr = arg.dateStr;
    setSelectedDate(dateStr);
    const available = getAvailableSlots(dateStr, serviceDuration);
    setSlots(available);
  };

  // Función para determinar el color de fondo según el número de franjas
  const getBackgroundColor = (count: number): string => {
    if (count >= 6) return "#6BC9BE"; // logo3
    if (count >= 4) return "#05AC9C"; // logo2
    if (count >= 2) return "#05668D"; // azulOscuroTitulos
    return "#253240"; // texto
  };

  // Cuando se cambia la vista del calendario, se generan eventos de fondo para cada día
  const handleDatesSet = (arg: DatesSetArg) => {
    const events = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Solo fecha

    let currentDate = new Date(arg.start);
    while (currentDate < arg.end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const available = getAvailableSlots(dateStr, serviceDuration);
      const count = available.length;

      // Si el día es anterior a hoy, se pinta en gris oscuro
      const bgColor = currentDate < today ? "#333333" : getBackgroundColor(count);

      events.push({
        id: dateStr,
        start: dateStr,
        allDay: true,
        display: "background",
        backgroundColor: bgColor,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setBackgroundEvents(events);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={backgroundEvents}
        datesSet={handleDatesSet}
      />
      {selectedDate && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">
            Horarios disponibles para {selectedDate}:
          </h4>
          <ul className="list-disc ml-6">
            {slots.length > 0 ? (
              slots.map((slot, index) => <li key={index}>{slot}</li>)
            ) : (
              <li>No hay horarios disponibles</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;
