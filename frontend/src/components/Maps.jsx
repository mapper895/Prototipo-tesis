import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useMapsStore } from "../store/mapsStore";
import { Loader } from "lucide-react";

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

  if (!apiKey)
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy",
    draggable: true,
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
