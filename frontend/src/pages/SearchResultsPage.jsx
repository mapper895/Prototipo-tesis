import { useEffect, useState } from "react";
import { useEventStore } from "../store/eventStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";
import { filterEvents } from "../utils/filterEvents";
import { Loader } from "lucide-react";
import SmallNavbar from "../components/SmallNavbar";

const AllEventsPage = () => {
  const { searchEvents, getEventsBySearch, isLoading } = useEventStore();
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterEvents(searchEvents, filter, selectedDate);
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
    if (searchEvents.length === 0) {
      getEventsBySearch();
    }
  }, [getEventsBySearch, searchEvents]);

  if (isLoading) {
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
        <div className="flex flex-col gap-5 my-5">
          <h2 className="md:text-6xl text-4xl font-light">
            Resultados sobre tu busqueda
          </h2>
          <p className="xl:text-lg text-sm">
            A continuacion se muestran todos los eventos que encontramos sobre
            tu busqueda &quot;
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

export default AllEventsPage;
