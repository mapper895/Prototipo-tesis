import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

// Store para gestionar la clave de la API de Google Maps y las coordenadas
export const useMapsStore = create((set) => ({
  apiKey: null, // Almacenará la API Key
  mapId: null,
  loading: false,
  error: null,

  // Función para obtener la API Key
  getApiKey: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/v1/maps/api-key`);
      set({ apiKey: response.data.apiKey, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Error al obtener la API Key"
      );
    }
  },

  getMapId: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/v1/maps/map-id`);
      set({ mapId: response.data.mapId, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Error al obtener Map Id");
    }
  },
}));
