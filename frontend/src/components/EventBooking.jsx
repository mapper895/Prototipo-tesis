import { useEffect, useState } from "react";
import CalendarComponent from "./CalendarComponent";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useReservationStore } from "../store/reservationStore";
import toast from "react-hot-toast";

const EventBooking = ({ event }) => {
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null); // Horario seleccionado
  const { isBooking, createReservation } = useReservationStore();
  const [isBooked, setIsBooked] = useState(false);

  // Funcion para formatear fecha a //Dia/fecha/mes
  const formatDate = (dateString) => {
    const date = parse(dateString, "dd/MM/yyyy", new Date());

    if (isNaN(date)) {
      console.log("Fecha invalida: ", dateString);
      return null;
    }

    const formattedDate = format(date, "EEE dd MMM", { locale: es });
    const [dayOfWeek, day, month] = formattedDate.split(" ");
    return { dayOfWeek, day, month };
  };

  // Funcion para seleccionar fecha cuando el array de fechas es menor a 4
  const handleDateSelect = (date) => {
    setSelectedDate(date === selectedDate ? null : date);
    setIsBooked(false);
  };

  // Funcion para seleccionar fecha cuando el array de fechas es mayor a 4
  const handleCalendarDateSelect = (date) => {
    const selectedCalendarDate = new Date(date);
    if (selectedCalendarDate.getTime() === selectedCalendarDate.getTime()) {
      setSelectedCalendarDate(selectedCalendarDate);
      setSelectedDate(null); // Limpiar la selección de fecha desde la lista si se selecciona desde el calendario
    }
    setIsBooked(false);
  };

  // Funcion para seleccionar horario
  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule === selectedSchedule ? null : schedule);
    setIsBooked(false);
  };

  // Funcion para realizar la reserva
  const handleBooking = () => {
    if (selectedSchedule && (selectedCalendarDate || selectedDate)) {
      if (selectedCalendarDate) {
        const formattedDate = format(selectedCalendarDate, "dd/MM/yyyy");
        createReservation(event._id, formattedDate, selectedSchedule);
      } else {
        createReservation(event._id, selectedDate, selectedSchedule);
      }
      setIsBooked(true);
    } else {
      toast.error("Por favor, selecciona una fecha y un horario.");
    }
  };

  useEffect(() => {
    setSelectedDate(null);
    setSelectedCalendarDate(null);
    setSelectedSchedule(null);
    setIsBooked(false);
  }, [event]);

  return (
    <div className="w-full flex-col items-center flex gap-10">
      {/* Calendario, muestra fechas disponibles */}
      <div className="w-4/5 flex justify-center items-center flex-col gap-5">
        <h2 className="text-2xl">Fechas disponibles</h2>
        {event.dates.length > 4 ? (
          <CalendarComponent
            dates={event.dates}
            onDateSelect={handleCalendarDateSelect}
            selectedDate={selectedCalendarDate}
          />
        ) : (
          <div className="flex gap-3 flex-wrap">
            {event.dates.map((date, index) => {
              const { dayOfWeek, day, month } = formatDate(date);
              const isSelected = selectedDate === date;
              return (
                <div
                  key={index}
                  className={`w-[120px] h-[50px] rounded-full flex items-center justify-center border ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "border-gray-500 hover:text-blue-500"
                  } cursor-pointer hover:border-blue-300`}
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="text-center">
                    {dayOfWeek} <br />
                    {day} {month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Muestra los horarios disponibles */}
      <div className="w-4/5 flex justify-center items-center flex-col gap-5">
        <h2 className="text-2xl">Horarios disponibles</h2>
        <div className="flex flex-col items-center w-full gap-5">
          {event.schedules ? (
            <>
              <div className="w-full flex flex-wrap justify-center gap-4 max-w-[340px]">
                {[...new Set(event.schedules)].map((schedule, index) => {
                  const isSelected = selectedSchedule === schedule;
                  return (
                    <div
                      key={index}
                      className={`w-[100px] h-[50px] rounded-full flex items-center justify-center border ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "border-gray-500 hover:text-blue-500"
                      } hover:border-blue-300 cursor-pointer`}
                      onClick={() => handleScheduleSelect(schedule)}
                    >
                      {schedule}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs">
                Duracion del evento: {event.duration} hrs.
              </p>
            </>
          ) : (
            <p>No hay horarios disponibles</p>
          )}
        </div>
      </div>

      {/* Botón para reservar el evento */}
      <div className="w-4/5 flex justify-center items-center gap-4">
        <button
          onClick={handleBooking}
          className={`px-10 py-4 rounded-xl p-2 ${
            isBooked
              ? "bg-blue-500 text-white"
              : "border border-gray-500 hover:text-blue-500"
          } hover:border-blue-300 cursor-pointer`}
          disabled={isBooking}
        >
          {isBooking
            ? "Reservando..."
            : isBooked
            ? "¡Reservado!"
            : "Reservar evento"}
        </button>
      </div>
    </div>
  );
};

export default EventBooking;
