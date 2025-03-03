import { Link, useParams } from "react-router-dom";
import { useEventStore } from "../store/eventStore";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Calendar, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";

const CategoryPage = () => {
  const { category } = useParams();
  const { eventsByCategory, getEventsByCategory, isLoadingEvents } =
    useEventStore();
  const categoryEvents = eventsByCategory[category] || []; // Obtiene eventos específicos de la categoría

  // Llama a la acción para obtener los eventos cuando el componente se monta o cambia la categoría
  useEffect(() => {
    if (!eventsByCategory[category]) {
      // Llama solo si no hay datos de la categoría
      getEventsByCategory(category);
    }
  }, [category, eventsByCategory, getEventsByCategory]);

  if (isLoadingEvents && categoryEvents.length === 0) {
    return <div>Cargando eventos...</div>;
  }

  if (categoryEvents.length === 0) {
    return <h2>No se encontraron eventos para la categoría {category}</h2>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to={"/"}>Inicio</Link>
            {">"}
            <p>
              {category.replaceAll("_", " ")[0].toUpperCase() +
                category.replaceAll("_", " ").slice(1)}
            </p>
          </div>
          <div className="text-6xl font-light">
            {category.replaceAll("_", " ")[0].toUpperCase() +
              category.replaceAll("_", " ").slice(1)}
          </div>
          <div className="text-lg">
            Descubre los 10 mejores eventos de {category.replaceAll("_", " ")}{" "}
            en la Ciudad de México.
          </div>
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
          {categoryEvents.map((event) => (
            <Link
              key={event._id}
              className="shadow-lg rounded-lg overflow-hidden "
              to={`/events/${event._id}`}
            >
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
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
