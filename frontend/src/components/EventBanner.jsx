import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useEventStore } from "../store/eventStore";

const EventBanner = ({ category }) => {
  const [showArrows, setshowArrows] = useState(false);
  const { eventsByCategory, getEventsByCategory, isLoadingEvents } =
    useEventStore();
  const categoryEvents = eventsByCategory[category] || []; // Eventos específicos de la categoría

  useEffect(() => {
    if (!eventsByCategory[category]) {
      // Llama solo si no existen eventos de la categoría en el estado
      getEventsByCategory(category);
    }
  }, [category, eventsByCategory, getEventsByCategory]);

  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  if (isLoadingEvents && categoryEvents.length === 0) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );
  }

  if (categoryEvents.length === 0) {
    return <h2>No se encontraron eventos para la categoría {category}</h2>;
  }

  const limitedEvents = categoryEvents.slice(0, 15);

  return (
    <div
      className="w-[1300px] flex flex-col gap-5 relative justify-evenly"
      onMouseEnter={() => setshowArrows(true)}
      onMouseLeave={() => setshowArrows(false)}
    >
      <div className="flex items-end justify-between">
        <div className="text-3xl">
          {category.replaceAll("_", " ")[0].toUpperCase() +
            category.replaceAll("_", " ").slice(1)}
        </div>
        <Link to={`/events/category/${category}`} className="hover:underline">
          Ver todo
        </Link>
      </div>

      <div
        className="flex mx-auto space-x-4 overflow-x-scroll scrollbar-hide w-full max-w-[1300px]"
        ref={sliderRef}
      >
        {limitedEvents.map((event) => (
          <Link
            to={`/events/${event._id}`}
            className="min-w-[250px] max-w-[250px] relative group shadow-lg mb-5"
            key={event._id}
          >
            <div className="rounded-lg mb-2">
              <img
                src={event.imageUrl}
                alt="Event Image"
                className="w-full h-[150px] transition-transform duration-300 ease-in-out group-hover:scale-110 object-cover"
              />
            </div>
            <div className="font-bold text-lg ml-2 line-clamp-2">
              {event.title}
            </div>
            <div className="text-sm mx-2 mb-2 line-clamp-2">
              {event.description}
            </div>
          </Link>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-7 flex items-center justify-center size-12 rounded-full bg-[#001f60] bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-7 flex items-center justify-center size-12 rounded-full bg-[#001f60] bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default EventBanner;
