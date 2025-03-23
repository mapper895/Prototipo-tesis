import { useState, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const LocationSearch = ({ apiKey, onSelect }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const [isLoaded, setisLoaded] = useState(false);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onSelect(place.formatted_address);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={["places"]}
      onLoad={() => setisLoaded(true)}
    >
      {isLoaded ? (
        <Autocomplete
          onLoad={(auto) => setAutocomplete(auto)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar ubicación..."
            className="w-full p-2 border border-[#001f60] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>
      ) : (
        <p className="text-gray-500"> Cargando...</p>
      )}
    </LoadScript>
  );
};

export default LocationSearch;
