import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEventStore } from "../store/eventStore";
import { Link } from "react-router-dom";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const { getEventsBySearch, events } = useEventStore();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.trim()) {
      getEventsBySearch(query);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query, getEventsBySearch]);

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleInputChange = (e) => {
  //   setQuery(e.target.value);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     getEventsBySearch(query);
  //   }
  // };

  return (
    <div className="relative w-[300px] max-w-md" ref={searchRef}>
      <form className="relative flex items-center w-[300px] max-w-md p-2 bg-[#001f60] border rounded-full shadow-sm">
        <span className="absolute left-3 text-white">
          <Search />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué estas buscando?"
          className="flex-grow p-2 pl-14 text-white placeholder-gray-200 bg-transparent border-none outline-none"
        />
      </form>

      {showResults && events.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              <h3 className="text-sm font-semibold text-gray-800">
                {event.title}
              </h3>
              <p className="text-xs text-gray-600">{event.address}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
