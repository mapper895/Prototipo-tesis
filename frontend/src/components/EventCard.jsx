import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const EventCard = ({
  event,
  editable = false,
  reservation = false,
  onDelete,
}) => {
  return (
    <div className="flex flex-col justify-between shadow-lg rounded-lg overflow-hidden">
      <Link to={`/events/${event._id}`}>
        <img
          src={event.imageUrl}
          alt="evento"
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
        />
        <div className="font-bold text-lg ml-2 line-clamp-2">{event.title}</div>
        <div className="text-gray-600 mx-2 mb-1 line-clamp-2">
          {event.description}
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

      {reservation && (
        <div className="flex md:flex-row flex-col">
          <div className="md:w-3/5 w-full p-2 bg-blue-200 flex-col items-center justify-center gap-2 text-sm">
            Reservación para el{" "}
            <span className="font-bold text-md">{reservation.eventDate}</span> a
            las{" "}
            <span className="font-bold text-md">
              {reservation.eventSchedule}
            </span>
          </div>
          <div
            className="md:w-2/5 w-full p-2 bg-red-500 flex items-center justify-center gap-2 text-sm cursor-pointer"
            onClick={() => onDelete(reservation._id)}
          >
            Eliminar reservacion <Trash2 size={30} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
