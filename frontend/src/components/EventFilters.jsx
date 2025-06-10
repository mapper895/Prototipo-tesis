import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventFilters = ({ filter, setFilter, selectedDate, setSelectedDate }) => {
  return (
    <div className="flex md:gap-5 gap-3 items-center md:mb-10 mb-4 flex-wrap">
      <div className="flex items-center gap-2 border border-[#001f60] px-4 py-2 rounded-xl bg-white ">
        <Calendar className="text-[#001f60]" size={14} />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setFilter("custom");
          }}
          placeholderText="Selecciona una fecha"
          className="bg-transparent outline-none md:text-base text-xs py-1"
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
        } items-center justify-center rounded-xl hover:cursor-pointer md:text-base text-xs`}
      >
        <Calendar size={14} />
        Hoy
      </div>

      <div
        onClick={() => {
          setFilter("week");
          setSelectedDate(null);
        }}
        className={`flex gap-2 px-5 py-3 border ${
          filter === "week" ? "bg-blue-100" : "border-[#001f60]"
        } items-center justify-center rounded-xl hover:cursor-pointer md:text-base text-xs`}
      >
        <Calendar size={14} />
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
  );
};

export default EventFilters;
