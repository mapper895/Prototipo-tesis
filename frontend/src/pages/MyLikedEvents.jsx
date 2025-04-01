import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authUser";
import { useEventStore } from "../store/eventStore";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Calendar, ChevronDown, SlidersHorizontal } from "lucide-react";

const MyLikedEvents = () => {
  const { user } = useAuthStore();
  const { getUserLikedEvents, events } = useEventStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserLikedEvents(user._id);
    }
  }, [user, getUserLikedEvents]);

  useEffect(() => {
    if (events) {
      setLoading(false);
    }
  }, [events]);

  if (loading) return <div>Cargando tus eventos...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to={"/"}>Inicio</Link>
            {">"}
            <p>Mis Eventos</p>
          </div>
          <div className="text-6xl font-light">Mis Likes</div>
        </div>

        {/* Filtros de eventos */}
        <div className="flex gap-5 items-center mb-10">
          <div className="flex gap-2 px-5 py-3 border border-[#001f60] items-center justify-center rounded-xl hover:cursor-pointer">
            <SlidersHorizontal />
            Ordenar por
            <ChevronDown />
          </div>
          <div className="flex gap-2 px-5 py-3 border border-[#001f60] items-center justify-center rounded-xl hover:cursor-pointer">
            <Calendar />
            Hoy
          </div>
          <div className="flex gap-2 px-5 py-3 border border-[#001f60] items-center justify-center rounded-xl hover:cursor-pointer">
            <Calendar />
            Esta semana
          </div>
        </div>

        <div className="grid grid-cols-4 gap-7 my-5">
          {events.map((event) => (
            <Link
              key={event._id}
              className="shadow-lg rounded-lg overflow-hidden "
              to={`/events/${event._id}`}
            >
              <img
                src={event.imageUrl}
                alt="evento"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
              />
              <div className="font-bold text-lg ml-2 mt-2">{event.title}</div>
              <div className="text-gray-600 mx-2 mb-1">
                {event.description.length > 60
                  ? `${event.description.slice(0, 55)}...`
                  : event.description}{" "}
                {event.description.length > 60 && (
                  <span className="text-blue-600 hover:underline mt-2">
                    Ver más
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyLikedEvents;
