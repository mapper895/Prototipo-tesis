import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useEventStore } from "../store/eventStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { useMapsStore } from "../store/mapsStore";
import toast from "react-hot-toast";
import EventFormComponent from "../components/EventFormComponent";
import { Loader } from "lucide-react";
import SmallNavbar from "../components/SmallNavbar";

const EventPage = () => {
  const { user } = useAuthStore();
  const { eventId } = useParams();
  const { getApiKey, apiKey } = useMapsStore();

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

  // Cuando el componente se monte, obtenemos las categorías y los datos del evento (si estamos editando)
  useEffect(() => {
    if (!apiKey) {
      getApiKey();
    }
    getCategories();
    if (eventId) {
      getEventById(eventId); // Llamamos para obtener el evento si estamos en edición
    }
    setIsLoading(false);
  }, [apiKey, getApiKey, getCategories, getEventById, eventId]);

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

  if (isLoading || !apiKey) {
    return (
      <div className="h-screen fixed top-0 right-0 z-99 ">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? <SmallNavbar /> : <Navbar />}
      <div className="flex justify-center items-center xl:mt-32 mb-5 mt-4 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-grey/60 rounded-lg shadow-md">
          <h1 className="text-center md:text-5xl text-3xl mb-4">
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
            apiKey={apiKey}
          />
        </div>
      </div>
    </>
  );
};

export default EventPage;
