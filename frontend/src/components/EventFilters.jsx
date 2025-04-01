import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventFilters = ({ filter, setFilter, selectedDate, setSelectedDate }) => {
  return (
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
  );
};

export default EventFilters;
