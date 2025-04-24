import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useEventStore } from "../store/eventStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import toast from "react-hot-toast";
import EventFormComponent from "../components/EventFormComponent";

const EventPage = () => {
  const { user } = useAuthStore();
  const { eventId } = useParams();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "",
    dates: [""],
    schedules: [""],
    location: "",
    imageUrl: "",
    duration: "",
    target: "",
    accessibility: "",
    organizer: "",
    eventUrl: "",
    costs: [{ type: "", price: "" }],
  });

  const [isLoading, setIsLoading] = useState(true);

  const {
    createEvent,
    updateEvent,
    isCreatingEvent,
    isUpdatingEvent,
    event,
    getEventById,
    categories,
    getCategories,
    isLoadingCategories,
  } = useEventStore();

  const navigate = useNavigate();

  // Cuando el componente se monte, obtenemos las categorías y los datos del evento (si estamos editando)
  useEffect(() => {
    getCategories();
    if (eventId) {
      getEventById(eventId); // Llamamos para obtener el evento si estamos en edición
    }
    setIsLoading(false);
  }, [getCategories, getEventById, eventId]);

  // Si estamos editando, cargamos los datos del evento en el estado
  useEffect(() => {
    if (event && eventId) {
      setEventData({
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        imageUrl: event.imageUrl,
        duration: event.duration,
        target: event.target,
        accessibility: event.accessibility,
        organizer: event.organizer,
        eventUrl: event.eventUrl,
        costs: event.costs || [{ type: "", price: "" }],
        dates: event.dates || [""],
        schedules: event.schedules || [""],
      });
      setIsLoading(false);
    }
  }, [event, eventId]);

  // Función para manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesión para crear o editar un evento");
      return;
    }

    let result;

    if (eventId) {
      // Si estamos en modo edición, llamamos a la función de actualización
      result = await updateEvent(eventId, eventData);
    } else {
      // Si estamos en modo creación, llamamos a la función de creación
      result = await createEvent(eventData);
    }

    if (result) {
      navigate("/"); // Redirige a la página principal
    }
  };

  // Si está cargando, mostramos un mensaje
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-grey/60 rounded-lg shadow-md">
          <h1 className="text-center text-5xl mb-4">
            {eventId ? "Editar evento" : "Crear evento"}
          </h1>

          {/* Usamos el componente EventForm */}
          <EventFormComponent
            eventData={eventData}
            setEventData={setEventData}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            handleSubmit={handleSubmit}
            isCreatingEvent={isCreatingEvent}
            isUpdatingEvent={isUpdatingEvent}
            eventId={eventId}
          />
        </div>
      </div>
    </>
  );
};

export default EventPage;
