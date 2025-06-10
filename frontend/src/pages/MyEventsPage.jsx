import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { useEventStore } from "../store/eventStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import { filterEvents } from "../utils/filterEvents";
import { Loader } from "lucide-react";
import SmallNavbar from "../components/SmallNavbar";

const MyEventsPage = () => {
  const { user } = useAuthStore();
  const {
    getUserEvents,
    userEvents,
    eventToDelete,
    setEventToDelete,
    clearEventToDelete,
    deleteEvent,
    isDeletingEvent,
    isLoading,
    clearUserEvents,
  } = useEventStore();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterEvents(userEvents, filter, selectedDate);
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
    if (user) {
      getUserEvents(user._id);
    } else {
      clearUserEvents();
    }
  }, [user, getUserEvents, clearUserEvents]);

  useEffect(() => {
    if (userEvents) {
      setLoading(false);
    }
  }, [userEvents]);

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
  };

  if (loading || isLoading)
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );

  return (
    <>
      {isMobile ? <SmallNavbar /> : <Navbar />}
      <div className="max-w-screen-xl mx-auto xl:mt-20 px-4 xl:px-0 mb-10">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to="/">Inicio</Link>
            {">"}
            <p>Mis Eventos</p>
          </div>
          <h2 className="md:text-6xl text-4xl font-light">Mis Eventos</h2>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {filteredEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-semibold">No se encontraron eventos.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 md:gap-7 gap-4 md:my-5 my-2">
            {userEvents ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  editable
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div>Cargando eventos ...</div>
            )}
          </div>
        )}
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

export default MyEventsPage;
