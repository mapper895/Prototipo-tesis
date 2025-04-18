import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useMapsStore } from "../store/mapsStore";

const MapsComponent = ({ lat, lng, location }) => {
  const { apiKey, getApiKey, mapId, getMapId } = useMapsStore();
  const position = { lat, lng };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!apiKey || !mapId) {
      getApiKey();
      getMapId();
    }
  }, [getApiKey, getMapId, apiKey, mapId]);

  if (!apiKey) return <div>Cargando mapa...</div>;

  const mapOptions = {
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true, // Habilitar tipo de mapa
    fullscreenControl: true,
    gestureHandling: "auto", // Habilitar zoom y desplazamiento con gestos
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-full w-full">
        <Map zoom={15} center={position} mapId={mapId} options={mapOptions}>
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>{location}</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapsComponent;
