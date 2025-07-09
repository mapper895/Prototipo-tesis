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
      className="max-w-screen-xl w-full flex flex-col gap-5 relative justify-evenly"
      onMouseEnter={() => setshowArrows(true)}
      onMouseLeave={() => setshowArrows(false)}
    >
      <div className="flex items-end justify-between mx-4 xl:mx-0">
        <div className="sm:text-3xl text-xl">
          {category.replaceAll("_", " ")[0].toUpperCase() +
            category.replaceAll("_", " ").slice(1)}
        </div>
        <Link
          to={`/events/category/${category}`}
          className="hover:underline sm:text-base text-xs"
        >
          Ver todo
        </Link>
      </div>

      <div
        className="flex w-full sm:mx-auto sm:space-x-4 space-x-2 xl:px-0 px-4 overflow-x-scroll scrollbar-hide"
        ref={sliderRef}
      >
        {limitedEvents.map((event) => (
          <Link
            to={`/events/${event._id}`}
            className="sm:min-w-[250px] sm:max-w-[250px] max-w-[110px] min-w-[110px] relative group shadow-lg mb-5"
            key={event._id}
          >
            <div className="rounded-lg mb-2">
              <img
                src={event.imageUrl || "/generic_event_image.jpg"}
                alt="Event Image"
                className="w-full sm:h-[150px] h-[110px] transition-transform duration-300 ease-in-out group-hover:scale-110 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/generic_event_image.jpg";
                }}
              />
            </div>
            <div className="font-bold sm:text-lg text-sm ml-2 line-clamp-2">
              {event.title}
            </div>
            <div className="sm:text-sm text-xs mx-2 mb-2 line-clamp-2">
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
