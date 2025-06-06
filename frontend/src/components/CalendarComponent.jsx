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

    // Resaltar la fecha de hoy
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "bg-blue-300 text-white font-bold";
    }
    if (date < today) {
      return "text-gray-300 font-bold";
    }
    // Resaltar las fechas del array 'dates'
    const isEventDate = eventDates.some(
      (eventDate) =>
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
    );

    if (isEventDate) {
      if (selectedDate && date.getTime() === selectedDate.getTime()) {
        return "bg-blue-500 text-white font-bold";
      }
      return "bg-blue-200 rounded-[4px] text-black font-semibold"; // Fechas del array
    }

    // El resto de las fechas
    return "text-gray-300 font-bold";
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
