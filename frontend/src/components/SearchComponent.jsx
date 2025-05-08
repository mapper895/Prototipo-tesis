import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEventStore } from "../store/eventStore";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const { getEventsBySearch, searchEvents } = useEventStore();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const debouncedSearch = useRef(
    debounce((query) => {
      getEventsBySearch(query);
      setShowResults(true);
    }, 500)
  ).current;

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setShowResults(false);
    }

    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

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

  // Redirige al usuario al presionar ENTER
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getEventsBySearch(query);
      setShowResults(true);
      // Redirigimos a la pagina de busqueda con el query
      navigate(`/search-results?query=${query}`);
      setQuery("");
    }
  };

  return (
    <div className="relative w-[300px] max-w-md" ref={searchRef}>
      <form
        className="relative flex items-center w-[300px] max-w-md p-2 bg-[#001f60] border rounded-full shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <span className="absolute left-3 text-white">
          <Search />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Qué estas buscando?"
          className="flex-grow p-2 pl-14 text-white placeholder-gray-200 bg-transparent border-none outline-none"
        />
      </form>

      {showResults && searchEvents.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchEvents.map((event) => (
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
