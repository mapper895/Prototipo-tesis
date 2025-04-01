import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useEventStore } from "../store/eventStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { useMapsStore } from "../store/mapsStore";
import toast from "react-hot-toast";

const EventPage = () => {
  const { user } = useAuthStore();
  const { apiKey, getApiKey } = useMapsStore();
  const { eventId } = useParams(); // Usamos 'eventId' de la URL para saber si estamos en "modo creacion" o "modo edicion"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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

  // Cuando el componente se monte, obtenemos las categorias y los datos del evento (si estamos editando)
  useEffect(() => {
    getCategories();
    if (eventId) {
      getEventById(eventId);
    }
  }, [getCategories, getEventById, eventId]);

  useEffect(() => {
    if (!apiKey) {
      getApiKey();
    } else {
      setIsLoading(false);
    }
  }, [getApiKey, apiKey]);

  // Si estamos editando, cargar los datos del evento en el estado
  useEffect(() => {
    if (event && eventId) {
      setTitle(event.title);
      setDescription(event.description);
      setCategory(event.category);
      setLocation(event.location);
      setImageUrl(event.imageUrl);
      setDate(event.date);
      setTime(event.time);
    }
  }, [event, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesion para crear o editar un evento");
      return;
    }

    const eventData = {
      title,
      description,
      category,
      date,
      time,
      location,
      imageUrl,
      organizer: user.username,
    };

    let result;

    if (eventId) {
      // Si estamos en modo edicion, llamamos a la funcion de actualizacion
      result = await updateEvent(eventId, eventData);
    } else {
      // Si estamos en modo creacion, llamamos a la funcion de creacion
      result = await createEvent(eventData);
    }

    if (result) {
      navigate("/"); //Redirige a la pagina principal
    }
  };

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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 block"
              >
                Titulo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="Nombre del evento"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 block"
              >
                Descripción
              </label>
              <textarea
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="Descripción del evento"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="categories"
                className="text-sm font-medium text-gray-700 block"
              >
                Categoria
              </label>
              <select
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                id="categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Seleccionar categoria</option>
                {isLoadingCategories
                  ? "Cargando categorias"
                  : categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium text-gray-700 block"
              >
                Lugar
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="Lugar del evento"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="categories"
                className="text-sm font-medium text-gray-700 block"
              >
                Dia del evento
              </label>
              <input
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="text-sm font-medium text-gray-700 block"
              >
                Horario de inicio del evento
              </label>
              <input
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="text-sm font-medium text-gray-700 block"
              >
                Url de la imagen del evento
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="https://imagen.com"
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <button
              className="w-full py-2 bg-[#001f60] text-white font-semibold rounded-md hover:bg-[#456eff] "
              disabled={isCreatingEvent}
            >
              {isCreatingEvent || isUpdatingEvent
                ? "Cargando..."
                : eventId
                ? "Actualizar Evento"
                : "Crear Evento"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EventPage;
