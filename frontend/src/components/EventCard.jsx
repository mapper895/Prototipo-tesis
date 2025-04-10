import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const EventCard = ({ event, editable = false, onDelete }) => {
  return (
    <div className="flex flex-col shadow-lg rounded-lg overflow-hidden">
      <Link to={`/events/${event._id}`}>
        <img
          src={event.imageUrl}
          alt="evento"
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
        />
        <div className="font-bold text-lg ml-2 mt-2">{event.title}</div>
        <div className="text-gray-600 mx-2 mb-1">
          {event.description.length > 60
            ? `${event.description.slice(0, 50)}...`
            : event.description}
          {event.description.length > 60 && (
            <span className="text-blue-600 hover:underline ml-2">Ver más</span>
          )}
        </div>
      </Link>

      {editable && (
        <div className="flex">
          <Link
            className="w-1/2 p-2 bg-blue-200 flex items-center justify-center gap-2 text-sm"
            to={`/edit-event/${event._id}`}
          >
            Editar evento <Pencil size={16} />
          </Link>
          <div
            className="w-1/2 p-2 bg-red-500 flex items-center justify-center gap-2 text-sm cursor-pointer"
            onClick={() => onDelete(event._id)}
          >
            Eliminar evento <Trash2 size={16} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
