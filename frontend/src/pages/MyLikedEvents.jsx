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

const MyLikedEvents = () => {
  const { user } = useAuthStore();
  const { getUserLikedEvents, eventUserLikes, isLoading } = useEventStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredEvents = filterEvents(eventUserLikes, filter, selectedDate);

  useEffect(() => {
    if (user) {
      getUserLikedEvents(user._id);
    }
  }, [user, getUserLikedEvents]);

  useEffect(() => {
    if (eventUserLikes) {
      setLoading(false);
    }
  }, [eventUserLikes]);

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
            <p>Mis Likes</p>
          </div>
          <h2 className="text-6xl font-light">Mis Likes</h2>
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

export default MyLikedEvents;
