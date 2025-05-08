import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEventStore } from "../store/eventStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";
import { filterEvents } from "../utils/filterEvents";
import { Loader } from "lucide-react";

const CategoryPage = () => {
  const { category } = useParams();
  const { eventsByCategory, getEventsByCategory, isLoadingEvents } =
    useEventStore();
  const categoryEvents = eventsByCategory[category] || [];

  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterEvents(categoryEvents, filter, selectedDate);

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
      <Navbar />
      <div className="max-w-[1300px] mx-auto mt-20">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to="/">Inicio</Link>
            {">"}
            <p className="capitalize">{category.replaceAll("_", " ")}</p>
          </div>
          <h2 className="text-6xl font-light capitalize">
            {category.replaceAll("_", " ")}
          </h2>
          <p className="text-lg">
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

export default CategoryPage;
