import { useEffect, useState } from "react";
import { useReservationStore } from "../store/reservationStore";
import Navbar from "../components/Navbar";
import EventFilters from "../components/EventFilters";
import { filterReservations } from "../utils/filterEvents";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authUser";

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
      <Navbar />
      <div className="max-w-[1300px] mx-auto mt-20">
        <div className="flex flex-col gap-5 my-5">
          <h2 className="text-6xl font-light">Mis Eventos Agendados</h2>
          <p className="text-lg">
            Aquí puedes ver todas tus eventos agendados.
          </p>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid grid-cols-4 gap-7 my-5">
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
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-xl font-semibold">¿Estás seguro?</h2>
            <p>¿Deseas eliminar este evento agendado?</p>
            <div className="mt-4 flex justify-end space-x-2">
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
