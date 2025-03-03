import { CalendarProps } from "@/lib/definitions";

const Cards = ({events, onCardHover}: {events: CalendarProps[]; onCardHover: (eventId: string | null) => void}) => {
  return (
    <>
      <div className="bg-slate-100 flex flex-col h-screen w-full lg:w-1/3 gap-4 p-4 pt-16">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-blue shadow-lg rounded-lg p-4 mb-4 border-l-4 border-blue-500"
            onMouseEnter={() => onCardHover(event.title)} // Aquí detectamos el hover
            onMouseLeave={() => onCardHover(null)} // Limpiamos el hover cuando el mouse sale
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

      <script></script>
    </>
  );
};

export default Cards;
