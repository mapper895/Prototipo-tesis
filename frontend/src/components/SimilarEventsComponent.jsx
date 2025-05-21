import { useEffect } from "react";
import { useEventStore } from "../store/eventStore";
import { Link } from "react-router-dom";

const SimilarEventsComponent = ({ event }) => {
  const { similarEvents, isLoadingSimilarEvents, getSimilarEvents } =
    useEventStore();

  useEffect(() => {
    if (event?._id) {
      getSimilarEvents(event._id);
    }
  }, [event, getSimilarEvents]);

  if (isLoadingSimilarEvents) {
    return <p>Cargando eventos similares ...</p>;
  }

  if (!similarEvents.length) {
    return;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Eventos similares</h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {similarEvents.map((event) => (
          <Link
            key={event._id}
            to={`/events/${event._id}`}
            className="min-w-[250px] max-w-[250px] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            <img
              src={event.imageUrl}
              alt="evento"
              className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
            />
            <div className="font-bold text-lg ml-2 line-clamp-2">
              {event.title}
            </div>
            <div className="text-gray-600 mx-2 mb-1 line-clamp-2">
              {event.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarEventsComponent;
