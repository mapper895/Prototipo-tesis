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
  } = useEventStore();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterEvents(userEvents, filter, selectedDate);

  useEffect(() => {
    if (user) {
      getUserEvents(user._id);
    }
  }, [user, getUserEvents]);

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
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to="/">Inicio</Link>
            {">"}
            <p>Mis Eventos</p>
          </div>
          <h2 className="text-6xl font-light">Mis Eventos</h2>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid grid-cols-4 gap-7 my-5">
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
