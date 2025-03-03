import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEventStore } from "../store/eventStore"; // Asegúrate de importar correctamente el store
import { useAuthStore } from "../store/authUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importa los estilos de react-calendar
import Maps from "../components/Maps";

const EventPage = () => {
  const { id } = useParams();
  const { event, getEventById, isFetchingEvent, toggleLike } = useEventStore();
  const { user } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para controlar la fecha seleccionada
  const [markedDate, setMarkedDate] = useState(null); // Estado para marcar la fecha del evento

  useEffect(() => {
    getEventById(id); // Llama a la función con el ID completo
  }, [id, getEventById]);

  useEffect(() => {
    if (event) {
      // Convierte la fecha del evento a un objeto Date
      const eventDate = new Date(event.date);
      setMarkedDate(eventDate); // Marca la fecha del evento
    }
  }, [event]);

  if (isFetchingEvent) {
    return <div>Cargando evento...</div>;
  }

  if (!event) {
    return <h2>Evento no encontrado</h2>;
  }

  return (
    <>
      <Navbar />
      <div className="main max-w-[1300px] mx-auto">
        <div className="evento flex flex-row">
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
            <div className="flex flex-col gap-5">
              <div className="text-4xl">Descripción</div>
              <div>{event.description}</div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-4xl">Ubicación</div>
              <div className="w-full h-[250px] z-50">
                {event.coordinates.lat && event.coordinates.lng && (
                  <Maps
                    lat={event.coordinates.lat}
                    lng={event.coordinates.lng}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="fecha-hora flex flex-col flex-1 items-center justify-center gap-10">
            <div className="text-6xl font-light">Fecha y Hora</div>

            {/* Aquí el calendario */}
            <div className="w-4/5 flex justify-center">
              <Calendar
                onChange={setSelectedDate} // Actualiza la fecha seleccionada
                value={selectedDate} // Muestra la fecha seleccionada
                tileClassName={({ date }) => {
                  // Marca la fecha del evento si coincide con la fecha seleccionada
                  return date.toDateString() === markedDate?.toDateString()
                    ? "highlight-date"
                    : "";
                }}
              />
            </div>

            {/* Muestra los días de la semana y el horario */}
            <div className="flex flex-row gap-5">
              {event.days && event.days.length > 0 ? (
                event.days.map((day, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="w-[100px] h-[50px] rounded-full bg-red-500 flex items-center justify-center hover:bg-red-700">
                      <span className="text-center">
                        {day} - {event.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div>No hay días programados</div>
              )}
            </div>
          </div>
        </div>
        <div className="eventos-similares">Eventos Similares</div>
      </div>
      <Footer />
    </>
  );
};

export default EventPage;
