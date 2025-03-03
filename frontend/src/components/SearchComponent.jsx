import { Search } from "lucide-react";
import { useState } from "react";

const SearchComponent = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Llama a la función de búsqueda con el término ingresado
      // onSearch(query);
      console.log(e.target.value);
    }
  };
  return (
    <form className="relative flex items-center w-[300px] max-w-md p-2 bg-[#001f60] border rounded-full shadow-sm">
      <span className="absolute left-3 text-white">
        <Search />
      </span>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="¿Qué estas buscando?"
        className="flex-grow p-2 pl-14 text-white placeholder-gray-200 bg-transparent border-none outline-none"
      />
    </form>
  );
};

export default SearchComponent;
