import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useEventStore } from "../store/eventStore"; // Asegúrate de importar correctamente el store
import { useAuthStore } from "../store/authUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart, Loader, Pencil, Trash2 } from "lucide-react";
import CalendarComponent from "../components/CalendarComponent";
import "react-calendar/dist/Calendar.css"; // Importa los estilos de react-calendar
import Maps from "../components/Maps";

const EventPage = () => {
  const { id } = useParams();
  const {
    event,
    getEventById,
    isFetchingEvent,
    toggleLike,
    setEventToDelete,
    eventToDelete,
    clearEventToDelete,
    deleteEvent,
    isDeletingEvent,
  } = useEventStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getEventById(id); // Llama a la función con el ID completo
  }, [id, getEventById]);

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
  };

  if (isFetchingEvent || !event) {
    return (
      <div>
        <Loader className="animate-spin text-[#001f60] size-10" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-row">
          {/* Lado derecho */}
          <div className="flex flex-col gap-10 flex-1">
            <div className="flex gap-5 items-end">
              <img
                src={event.imageUrl}
                alt="imagen_evento"
                className="w-[200px] h-[300px] object-cover"
              />
              <div className="text-6xl font-light">{event.title}</div>
              {/* Boton de likes*/}
              <button onClick={() => toggleLike(event._id)}>
                <Heart
                  size={30}
                  className={`cursor-pointer transition-colors duration-300 ${
                    event.likedBy.includes(user?._id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-500 fill-none"
                  }`}
                />
              </button>
              <span className="text-gray-700">{event.likesCount}</span>
            </div>

            {/* Botones de edicion o eliminacion de eventos */}
            {user && event.createdBy === user._id && (
              <div className="flex justify-evenly w-full">
                <Link
                  className="px-10 py-4 rounded-xl p-2 bg-blue-200 flex items-center justify-center gap-2 text-sm"
                  to={`/edit-event/${event._id}`}
                >
                  Editar evento <Pencil size={16} />
                </Link>
                <div
                  className="px-10 py-4 rounded-xl p-2 bg-red-500 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  onClick={() => handleDeleteClick(event._id)}
                >
                  Eliminar evento <Trash2 size={16} />
                </div>
              </div>
            )}

            {/* Descripcion */}
            <div className="flex flex-col gap-5">
              <div className="text-4xl">Descripción</div>
              <div>{event.description}</div>
            </div>

            {/* Ubicacion */}
            <div className="flex flex-col gap-5">
              <div className="text-4xl">Ubicación</div>
              <p>{event.location}</p>
              <div className="w-full h-[250px] z-50">
                {event.latitude && event.longitude && (
                  <Maps
                    lat={event.latitude}
                    lng={event.longitude}
                    location={event.location}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Lado izquierdo */}
          <div className="flex flex-col flex-1 items-center mt-20 gap-10">
            <div className="text-6xl font-light">Fecha y Hora</div>

            {/* Calendario, muestra fechas disponibles */}
            <div className="w-4/5 flex justify-center items-center flex-col gap-5">
              <h2 className="text-2xl">Fechas disponibles</h2>
              <CalendarComponent dates={event.dates} />
            </div>

            {/* Muestra los horarios disponibles */}
            <div className="w-4/5 flex justify-center items-center flex-col gap-5">
              <h2 className="text-2xl">Horarios disponibles</h2>
              <div className="flex flex-row gap-5">
                {event.schedules ? (
                  <div className="flex flex-col items-center gap-4">
                    {event.schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="w-[100px] h-[50px] rounded-full flex items-center justify-center border border-gray-500 hover:text-blue-500 cursor-pointer hover:border-blue-300"
                      >
                        {schedule}
                      </div>
                    ))}
                    <p className="text-xs">
                      Duracion del evento: {event.duration} hrs.
                    </p>
                  </div>
                ) : (
                  <p>No hay horarios disponibles</p>
                )}
              </div>
            </div>

            {/* Muestra los tipos de boletos o costos */}
            <div className="w-4/5 flex  flex-col">
              <h2 className="text-2xl mx-auto">Precios disponibles</h2>
              <div className="space-y-4">
                {event.costs ? (
                  event.costs.map((cost) => (
                    <div
                      key={cost._id}
                      className="flex justify-between items-center p-4 border-b"
                    >
                      <span>{cost.type}</span>
                      <span>{cost.price}</span>
                    </div>
                  ))
                ) : (
                  <p>No hay horarios disponibles</p>
                )}
              </div>
            </div>

            {/* Muestra los datos extra del evento */}
            <div className="w-4/5 flex flex-col items-center gap-4">
              <h2 className="text-2xl mx-auto">Información adicional</h2>
              <p>Organziador del evento: {event.organizer}</p>
              <p>Edad: {event.target}</p>
              <Link
                className="border rounded-full px-10 py-4 border-gray-500 hover:text-blue-500 hover:border-blue-300"
                to={event.eventUrl}
              >
                Más información del evento
              </Link>
            </div>
          </div>
        </div>
        <div className="eventos-similares">Eventos Similares</div>
      </div>

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
                disabled={isDeletingEvent}
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

export default EventPage;
