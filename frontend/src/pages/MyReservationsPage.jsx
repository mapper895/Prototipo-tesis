import { useEffect, useState } from "react";
import { useReservationStore } from "../store/reservationStore";
import Navbar from "../components/Navbar";
import EventFilters from "../components/EventFilters";
import { filterReservations } from "../utils/filterEvents";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import SmallNavbar from "../components/SmallNavbar";

const MyReservationsPage = () => {
  const { user } = useAuthStore();
  const {
    reservations,
    eventToDelete,
    setEventToDelete,
    clearEventToDelete,
    deleteEvent,
    isDeletingEvent,
    getUserReservations,
    isLoading,
    clearReservations,
  } = useReservationStore();

  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterReservations(reservations, filter, selectedDate);
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

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
  };

  const handleCancel = () => {
    clearEventToDelete();
  };

  useEffect(() => {
    if (user) {
      getUserReservations();
    }
    return () => {
      clearReservations();
    };
  }, [user, getUserReservations, clearReservations]);

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
      <div className="max-w-screen-xl mx-auto xl:mt-20 px-4 xl:px-0 mb-10">
        <div className="flex flex-col gap-5 my-5">
          <h2 className="md:text-6xl text-4xl font-light">
            Mis Eventos Agendados
          </h2>
          <p className="md:text-lg text-sm">
            Aquí puedes ver todas tus eventos agendados.
          </p>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 md:gap-7 gap-4 md:my-5 my-2">
          {reservations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl font-semibold">
                No tienes eventos agendados.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event.eventId}
                reservation={event}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      </div>

      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl">
          <div className="bg-white p-6 rounded shadow-md text-center w-[300px]">
            <h2 className="text-xl font-semibold">¿Estás seguro?</h2>
            <p>¿Deseas eliminar este evento agendado?</p>
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={handleCancel}
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

export default MyReservationsPage;
