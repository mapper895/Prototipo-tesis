import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEventStore } from "../store/eventStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";
import { filterEvents } from "../utils/filterEvents";
import { Loader } from "lucide-react";
import SmallNavbar from "../components/SmallNavbar";

const CategoryPage = () => {
  const { category } = useParams();
  const { eventsByCategory, getEventsByCategory, isLoadingEvents } =
    useEventStore();
  const categoryEvents = eventsByCategory[category] || [];

  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterEvents(categoryEvents, filter, selectedDate);
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
    if (!eventsByCategory[category]) {
      getEventsByCategory(category);
    }
  }, [category, eventsByCategory, getEventsByCategory]);

  if (isLoadingEvents && categoryEvents.length === 0) {
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
      <div className="max-w-screen-xl mx-auto xl:mt-20 p-4 xl:p-0">
        <div className="flex flex-col gap-5 xl:my-5 mb-4">
          <div className="flex gap-2 xl:text-base text-xs">
            <Link to="/">Inicio</Link>
            {">"}
            <p className="capitalize">{category.replaceAll("_", " ")}</p>
          </div>
          <h2 className="md:text-6xl text-4xl font-light capitalize">
            {category.replaceAll("_", " ")}
          </h2>
          <p className="xl:text-lg text-sm">
            Descubre los mejores eventos de {category.replaceAll("_", " ")} en
            la Ciudad de México.
          </p>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 md:gap-7 gap-4 md:my-5 my-2">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
