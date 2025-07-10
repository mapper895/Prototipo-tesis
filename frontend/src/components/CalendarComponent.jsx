import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);

const CalendarComponent = ({ dates, selectedDate, onDateSelect }) => {
  const eventDates = dates.map((date) => {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  });

  // Función para aplicar las clases a los días
  const dayClassName = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // eliminar la hora
    const target = new Date(date);
    target.setHours(0, 0, 0, 0); // también quitar hora a la fecha comparada

    if (target.getTime() === today.getTime()) {
      return "bg-blue-300 text-white font-bold"; // fecha de hoy
    }

    if (target < today) {
      return "text-gray-300 font-bold"; // fechas pasadas
    }

    const isEventDate = eventDates.some((eventDate) => {
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === target.getTime();
    });

    if (isEventDate) {
      if (selectedDate && target.getTime() === selectedDate.getTime()) {
        return "bg-blue-500 text-white font-bold"; // seleccionada
      }
      return "bg-blue-200 rounded-[4px] text-black font-semibold"; // fechas disponibles
    }

    return "text-gray-300 font-bold"; // fechas no válidas
  };

  const handleDateSelect = (date) => {
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
      onDateSelect(null);
    } else {
      onDateSelect(date);
    }
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => handleDateSelect(date)}
        inline
        dayClassName={dayClassName}
        highlightDates={[]} // No necesitamos resaltar fechas por fuera de dayClassName
        locale="es" // Establece el locale a español
      />
    </div>
  );
};

export default CalendarComponent;
