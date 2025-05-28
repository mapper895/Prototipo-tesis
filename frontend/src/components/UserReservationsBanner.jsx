import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useReservationStore } from "../store/reservationStore"; // Usamos el store de reservas

const UserReservationsBanner = ({ user }) => {
  const [showArrows, setShowArrows] = useState(false);
  const { reservations, isLoading, getUserReservations, clearReservations } =
    useReservationStore(); // Usamos el store para obtener las reservas del usuario

  useEffect(() => {
    // Obtenemos las reservas del usuario cuando el componente se monta
    if (user) {
      getUserReservations();
    }

    // Limpiar las reservas cuando el componente se desmonte
    return () => {
      clearReservations();
    };
  }, [getUserReservations, clearReservations, user]);

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

  if (isLoading && (!reservations || reservations.length === 0)) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return null;
  }

  return (
    <div
      className="w-[1300px] flex flex-col gap-5 relative justify-evenly"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="flex items-end justify-between">
        <div className="text-3xl">Tus eventos agendados</div>
      </div>

      <div
        className="flex w-full mx-auto space-x-4 overflow-x-scroll scrollbar-hide"
        ref={sliderRef}
      >
        {reservations.map((reservation) => (
          <Link
            to={`/events/${reservation.eventId._id}`}
            className="max-w-[250px] min-w-[250px] relative group shadow-lg mb-5"
            key={reservation._id}
          >
            <div className="rounded-lg mb-2">
              <img
                src={reservation.eventId.imageUrl}
                alt="Evento de la reserva"
                className="w-full h-[150px] transition-transform duration-300 ease-in-out group-hover:scale-110 object-cover"
              />
            </div>
            <div className="font-bold text-lg ml-2 line-clamp-2">
              {reservation.eventId.title} {/* Título del evento */}
            </div>
            <div className="text-sm mx-2 mb-2 line-clamp-2">
              {reservation.eventId.description} {/* Descripción del evento */}
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

export default UserReservationsBanner;
