import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import { CalendarProps } from "@/lib/definitions";
import '@/app/mis-citas/mis-citas.css';

const Calendar = ({ events }: { events: CalendarProps[] }) => {
  return (
    <div className="w-[1000px] h-[800px] mx-auto mt-4 bg-white p-4 rounded-md shadow-lg">
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
          <div /*className="bg-blue-500 text-white p-2 rounded-md w-full h-full flex items-center justify-center"*/>
            {eventInfo.event.title}
          </div>
        )}
        height="100%"
      />
    </div>
  );
};

export default Calendar;