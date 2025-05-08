import { useEffect, useState } from "react";
import { useEventStore } from "../store/eventStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";
import { filterEvents } from "../utils/filterEvents";
import { Loader } from "lucide-react";
import { useLocation } from "react-router-dom";

const AllEventsPage = () => {
  const { searchEvents, getEventsBySearch, isLoading } = useEventStore();
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const filteredEvents = filterEvents(searchEvents, filter, selectedDate);

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
      <Navbar />
      <div className="max-w-[1300px] mx-auto mt-20">
        <div className="flex flex-col gap-5 my-5">
          <h2 className="text-6xl font-light">Busqueda de: {query}</h2>
          <p className="text-lg">
            A continuacion todos los eventos que encontramos sobre &quot;{query}
            &quot;
          </p>
        </div>

        <EventFilters
          filter={filter}
          setFilter={setFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="grid grid-cols-4 gap-7 my-5">
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
