import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authUser";
import { useEventStore } from "../store/eventStore";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import {
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

const MyEventsPage = () => {
  const { user } = useAuthStore();
  const {
    getUserEvents,
    events,
    eventToDelete,
    setEventToDelete,
    clearEventToDelete,
    deleteEvent,
    isDeletingEvent,
  } = useEventStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserEvents(user._id);
    }
  }, [user, getUserEvents]);

  useEffect(() => {
    if (events) {
      setLoading(false);
    }
  }, [events]);

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
  };

  if (loading) return <div>Cargando tus eventos...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to={"/"}>Inicio</Link>
            {">"}
            <p>Mis Eventos</p>
          </div>
          <div className="text-6xl font-light">Mis Eventos</div>
        </div>

        {/* Filtros de eventos */}
        <div className="flex gap-5 items-center mb-10">
          <div className="flex gap-2 px-5 py-3 border border-[#001f60] items-center justify-center rounded-xl hover:cursor-pointer">
            <SlidersHorizontal />
            Ordenar por
            <ChevronDown />
          </div>
          <div className="flex gap-2 px-5 py-3 border border-[#001f60] items-center justify-center rounded-xl hover:cursor-pointer">
            <Calendar />
            Hoy
          </div>
          <div className="flex gap-2 px-5 py-3 border border-[#001f60] items-center justify-center rounded-xl hover:cursor-pointer">
            <Calendar />
            Esta semana
          </div>
        </div>

        <div className="grid grid-cols-4 gap-7 my-5">
          {events.map((event) => (
            <div
              className="flex flex-col shadow-lg rounded-lg overflow-hidden"
              key={event._id}
            >
              <Link to={`/events/${event._id}`}>
                <img
                  src={event.imageUrl}
                  alt="evento"
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
                />
                <div className="font-bold text-lg ml-2 mt-2">{event.title}</div>
                <div className="text-gray-600 mx-2 mb-1">
                  {event.description.length > 60
                    ? `${event.description.slice(0, 55)}...`
                    : event.description}{" "}
                  {event.description.length > 60 && (
                    <span className="text-blue-600 hover:underline mt-2">
                      Ver más
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex">
                <Link
                  className="w-1/2 p-2 bg-blue-200 flex items-center justify-center gap-2 text-sm"
                  to={`/edit-event/${event._id}`}
                >
                  Editar evento <Pencil size={16} />
                </Link>
                <div
                  className="w-1/2 p-2 bg-red-500 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  onClick={() => handleDeleteClick(event._id)}
                >
                  Eliminar evento <Trash2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmacion */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-xl font-semibold">¿Estás seguro?</h2>
            <p>¿Deseas eliminar este evento?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={clearEventToDelete}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={deleteEvent}
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={isDeletingEvent} // Deshabilita el botón mientras se está eliminando
              >
                {isDeletingEvent ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default MyEventsPage;
