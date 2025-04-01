import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";

import { useEventStore } from "../store/eventStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AllEventsPage = () => {
  const { events, getAllEvents, isLoadingEvents } = useEventStore();
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (events.length === 0) {
      getAllEvents();
    }
  }, [getAllEvents, events]);

  const getFilteredEvents = () => {
    const now = new Date();

    if (selectedDate) {
      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    if (filter === "today") {
      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === now.getDate() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      });
    }

    if (filter === "week") {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(now.getDate() + 7);

      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= oneWeekFromNow;
      });
    }

    return events;
  };

  if (isLoadingEvents && events.length === 0) {
    return <div className="text-center py-10">Cargando eventos...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to={"/"}>Inicio</Link>
            {">"}
            <p>Eventos</p>
          </div>
          <div className="text-6xl font-light">Todos los Eventos</div>
          <div className="text-lg">
            Explora todos los eventos disponibles en la plataforma.
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-5 items-center mb-10 flex-wrap">
          <div className="flex items-center gap-2 border border-[#001f60] px-4 py-2 rounded-xl bg-white">
            <Calendar className="text-[#001f60]" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setFilter("custom");
              }}
              placeholderText="Selecciona una fecha"
              className="bg-transparent outline-none text-sm"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div
            onClick={() => {
              setFilter("today");
              setSelectedDate(null);
            }}
            className={`flex gap-2 px-5 py-3 border ${
              filter === "today" ? "bg-blue-100" : "border-[#001f60]"
            } items-center justify-center rounded-xl hover:cursor-pointer`}
          >
            <Calendar />
            Hoy
          </div>

          <div
            onClick={() => {
              setFilter("week");
              setSelectedDate(null);
            }}
            className={`flex gap-2 px-5 py-3 border ${
              filter === "week" ? "bg-blue-100" : "border-[#001f60]"
            } items-center justify-center rounded-xl hover:cursor-pointer`}
          >
            <Calendar />
            Esta semana
          </div>

          <div
            onClick={() => {
              setFilter("all");
              setSelectedDate(null);
            }}
            className={`flex gap-2 px-5 py-3 border ${
              filter === "all" ? "bg-blue-100" : "border-[#001f60]"
            } items-center justify-center rounded-xl hover:cursor-pointer`}
          >
            Todos
          </div>

          {selectedDate && (
            <button
              onClick={() => {
                setSelectedDate(null);
                setFilter("all");
              }}
              className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
            >
              Limpiar fecha
            </button>
          )}
        </div>

        {/* Lista de eventos */}
        <div className="grid grid-cols-4 gap-7 my-5">
          {getFilteredEvents().map((event) => (
            <Link
              key={event._id}
              className="shadow-lg rounded-lg overflow-hidden"
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
                  : event.description}
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

export default AllEventsPage;
