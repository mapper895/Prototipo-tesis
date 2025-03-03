import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMapsStore } from "../store/mapsStore.js";
import { useEffect, useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const MapComponent = ({ lat, lng }) => {
  const center = { lat: lat, lng: lng };
  const { getApiKey, apiKey } = useMapsStore();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (!apiKey) {
      getApiKey();
    }
  }, [apiKey, getApiKey]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setMarkerPosition(center);
        setRenderKey((prev) => prev + 1);
      }, 100);
    }
  }, [isLoaded]);

  //   if (!apiKey || loading) return <p>Cargando mapa...</p>;

  if (!isLoaded) return <p>No se pudo cargar el mapa.</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={15}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {markerPosition && <Marker key={renderKey} position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapComponent;
