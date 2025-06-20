import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../store/eventStore"; // Asegúrate de importar correctamente el store
import { useAuthStore } from "../store/authUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart, Loader, Map, Pencil, Trash2 } from "lucide-react";
import "react-calendar/dist/Calendar.css"; // Importa los estilos de react-calendar
import Maps from "../components/Maps";
import EventBooking from "../components/EventBooking";
import SimilarEventsComponent from "../components/SimilarEventsComponent";
import SmallNavbar from "../components/SmallNavbar";

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
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar el tamaño de la pantalla
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 1280); // Consideramos 768px o menos como pantallas pequeñas
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize); // Escuchar cambios de tamaño

    return () => window.removeEventListener("resize", checkScreenSize); // Limpiar el evento
  }, []);

  useEffect(() => {
    getEventById(id); // Llama a la función con el ID completo
  }, [id, getEventById]);

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
  };

  const handleDeleteAndRedirect = async () => {
    try {
      await deleteEvent();

      navigate("/");
    } catch (error) {
      console.log("Error al eliminar el evento: ", error);
    }
  };

  if (isFetchingEvent || !event) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? <SmallNavbar /> : <Navbar />}
      <div className="max-w-screen-xl mx-auto xl:mt-20 px-4 xl:px-0">
        <div className="flex md:flex-row flex-col">
          {/* Lado izquierdo */}
          <div className="flex flex-col gap-10 flex-1">
            <div className="w-full flex flex-col gap-5 border-b pb-5">
              <img
                src={event.imageUrl}
                alt="imagen_evento"
                className="w-full h-[250px] object-cover"
              />
              <div className="flex justify-between">
                <div className="md:text-4xl text-2xl font-light px-2 md:px-0">
                  {event.title}
                </div>
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
                {/* Boton para compartir, ***falta por hacer*** */}
              </div>
              {/* Botones de edicion o eliminacion de eventos */}
              {user && event.createdBy === user._id && (
                <div className="flex justify-evenly w-full">
                  <Link
                    className="md:px-10 px-5 py-4 rounded-xl p-2 bg-blue-200 flex items-center justify-center gap-2 md:text-sm text-xs"
                    to={`/edit-event/${event._id}`}
                  >
                    Editar evento <Pencil size={16} />
                  </Link>
                  <div
                    className="md:px-10 px-5 py-4 rounded-xl p-2 bg-red-500 flex items-center justify-center gap-2 md:text-sm text-xs cursor-pointer"
                    onClick={() => handleDeleteClick(event._id)}
                  >
                    Eliminar evento <Trash2 size={16} />
                  </div>
                </div>
              )}
            </div>

            {/* Descripcion */}
            <div className="flex flex-col gap-5">
              <div className="md:text-4xl text-2xl">Descripción</div>
              <div className="md:text-base text-sm">{event.description}</div>
            </div>

            {/* Ubicacion */}
            <div className="flex gap-5">
              <div className="flex md:flex-row flex-col gap-4 w-full">
                <div className="md:w-2/5 w-full flex flex-col justify-between gap-4 mb-4">
                  <div className="md:text-4xl text-2xl">Ubicación</div>
                  <p className="my-auto">{event.location}</p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    className="flex gap-4 border w-fit px-4 py-2 rounded-full border-gray-500 hover:text-blue-500 cursor-pointer hover:border-blue-300"
                  >
                    <Map />
                    ¿Como llegar?
                  </a>
                </div>
                <div className="md:w-3/5 w-full h-[250px]">
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
          </div>
          {/* Lado derecho */}
          <div className="flex flex-col flex-1 md:items-center md:mt-20 mt-10 gap-10">
            <div className="md:text-6xl text-3xl font-light">Fecha y Hora</div>

            {/* Calendario y horarios | Boton de reserva/notificacion */}
            <EventBooking event={event} />

            {/* Muestra los tipos de boletos o costos */}
            <div className="md:w-4/5 w-full flex flex-col">
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
                  <p>No hay precios disponibles</p>
                )}
              </div>
            </div>

            {/* Muestra los datos extra del evento */}
            <div className="md:w-4/5 w-full flex flex-col items-center gap-4 text-center">
              <h2 className="md:text-2xl text-xl mx-auto">
                Información adicional
              </h2>
              <p>Organziador del evento: {event.organizer}</p>
              <p>Edad: {event.target}</p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-full px-10 py-4 border-gray-500 hover:text-blue-500 hover:border-blue-300"
                href={event.eventUrl}
              >
                Más información del evento
              </a>
            </div>
          </div>
        </div>

        <SimilarEventsComponent event={event} />
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
                onClick={handleDeleteAndRedirect}
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
