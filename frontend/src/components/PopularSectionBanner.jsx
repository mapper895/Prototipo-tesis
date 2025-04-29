import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEventStore } from "../store/eventStore";

const PopularSectionBanner = () => {
  const [showArrows, setshowArrows] = useState(false);
  const sliderRef = useRef(null);

  const { popularEvents, getPopularEvents, isLoadingEvents } = useEventStore();

  useEffect(() => {
    if (!popularEvents || popularEvents.length === 0) {
      // Llama solo si no existen eventos
      getPopularEvents();
    }
  }, [popularEvents, getPopularEvents]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behaviour: "smooth",
      });
    }
  };
  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behaviour: "smooth",
    });
  };

  if (isLoadingEvents)
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );

  return (
    <div className="bg-[#001f60] w-full h-[480px]">
      <div
        className="max-w-[1300px] relative mx-auto py-10"
        onMouseEnter={() => setshowArrows(true)}
        onMouseLeave={() => setshowArrows(false)}
      >
        <div className="flex items-center justify-between mb-5 text-white">
          <h2 className="text-2xl font-bold">Top 10 eventos en CDMX</h2>
          <Link
            to={"/top-10-cdmx"}
            className="text-sm font-medium hover:underline"
          >
            Ver todo
          </Link>
        </div>
        <div
          className="flex space-x-4 overflow-x-scroll scrollbar-hide"
          ref={sliderRef}
        >
          {popularEvents.map((event, index) => (
            <Link
              to={`/events/${event._id}`}
              className="relative min-w-[250px] group"
              key={event._id}
            >
              <div className="relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-[300px] object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-110"
                />
                <div
                  className="absolute bottom-2 left-3 text-8xl font-bold text-white"
                  style={{
                    textShadow:
                      "3px 3px 0 #000, -3px -3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000",
                  }}
                >
                  {index + 1}
                </div>
              </div>
              <div className="mt-4 text-base font-semibold text-white">
                {event.title}
              </div>
            </Link>
          ))}
        </div>

        {showArrows && (
          <>
            <button
              className="absolute top-1/2 -translate-y-1/2 left-2 md:left-1 flex items-center justify-center size-12 rounded-full bg-[#001f60] bg-opacity-50 hover:bg-opacity-75 text-white z-10"
              onClick={scrollLeft}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 -translate-y-1/2 right-2 md:right-1 flex items-center justify-center size-12 rounded-full bg-[#001f60] bg-opacity-50 hover:bg-opacity-75 text-white z-10"
              onClick={scrollRight}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PopularSectionBanner;
