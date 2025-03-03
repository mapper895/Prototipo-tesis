import { useEffect } from "react";
import { useEventStore } from "../store/eventStore"; // Asegúrate de importar correctamente

const EventsList = () => {
  const { events, getAllEvents, isLoadingEvents } = useEventStore();

  useEffect(() => {
    getAllEvents();
    console.log(events);
  }, [getAllEvents]);

  if (isLoadingEvents) return <div>Cargando eventos...</div>;

  return (
    <div>
      <h1>Lista de Eventos</h1>
      <ul>
        {events.map((event) => (
          <li className="text-black" key={event._id}>
            {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsList;
