import { useEffect, useState } from "react";
import { useReservationStore } from "../store/reservationStore";
import Navbar from "../components/Navbar";
import EventFilters from "../components/EventFilters";
import { filterReservations } from "../utils/filterEvents";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { Loader } from "lucide-react";

const MyReservationsPage = () => {
  const { reservations, getUserReservations, isLoading } =
    useReservationStore();

  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterReservations(reservations, filter, selectedDate);

  useEffect(() => {
    getUserReservations();
  }, [getUserReservations]);

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
          <h2 className="text-6xl font-light">Mis Reservaciones</h2>
          <p className="text-lg">
            Aquí puedes ver todas tus reservaciones realizadas.
          </p>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid grid-cols-4 gap-7 my-5">
          {console.log(filteredEvents)}
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event.eventId}
              reservation={event}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyReservationsPage;
