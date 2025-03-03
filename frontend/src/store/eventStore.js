import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./authUser";

export const useEventStore = create((set, get) => ({
  events: [],
  eventsByCategory: {},
  categories: [],
  event: null,
  isCreatingEvent: false,
  isLoadingEvents: true,
  isLoadingCategories: false,
  isFetchingEvent: false,
  isUpdatingEvent: false,
  isDeletingEvent: false,
  mapData: null,
  isFetchingMapData: false,
  coordinates: null,
  setCoordinates: (coords) => set({ coordinates: coords }),

  createEvent: async (eventData) => {
    set({ isCreatingEvent: true });
    try {
      const response = await axios.post(
        "/api/v1/events/create-event",
        eventData
      );
      set({
        events: [...set.events, response.data.event],
        isCreatingEvent: false,
      });
      toast.success("Evento creado con éxito");
    } catch (error) {
      set({ isCreatingEvent: false });
      toast.error(error.response?.data?.message || "Error al crear el evento");
    }
  },

  getAllEvents: async () => {
    set({ isLoadingEvents: true });
    try {
      const response = await axios.get("/api/v1/event/events");
      set({ events: response.data.events, isLoadingEvents: false });
    } catch (error) {
      set({ isLoadingEvents: false });
      toast.error(
        error.response?.data?.message || "Error al cargar los eventos"
      );
    }
  },

  getEventById: async (id) => {
    set({ isFetchingEvent: true });
    try {
      const response = await axios.get(`/api/v1/event/events/${id}`);
      set({ event: response.data.event, isFetchingEvent: false });
    } catch (error) {
      set({ isFetchingEvent: false });
      toast.error(
        error.response?.data?.message || "Error al obtener el evento"
      );
    }
  },

  getEventsByCategory: async (category) => {
    set({ isLoadingEvents: true });
    try {
      const response = await axios.get(
        `/api/v1/event/events/category/${category}`
      );
      set((state) => ({
        eventsByCategory: {
          ...state.eventsByCategory, // Conserva las categorías previas
          [category]: response.data.events || [], // Agrega o actualiza los eventos de la categoría específica
        },
        isLoadingEvents: false,
      }));
    } catch (error) {
      set({ isLoadingEvents: false });
      toast.error(
        error.response?.data?.message ||
          "Error al cargar los eventos por categoría"
      );
    }
  },

  getCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      const response = await axios.get("/api/v1/event/categories");
      set({ categories: response.data.categories, isLoadingCategories: false });
    } catch (error) {
      console.error("Error al obtener categorías", error);
      set({ isLoadingCategories: false });
    }
  },

  updateEvent: async (id, eventData) => {
    set({ isUpdatingEvent: true });
    try {
      const response = await axios.put(`/api/v1/events/${id}`, eventData);
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...response.data.event } : event
        ),
        isUpdatingEvent: false,
      }));
      toast.success("Evento actualizado con éxito");
    } catch (error) {
      set({ isUpdatingEvent: false });
      toast.error(
        error.response?.data?.message || "Error al actualizar el evento"
      );
    }
  },

  deleteEvent: async (id) => {
    set({ isDeletingEvent: true });
    try {
      await axios.delete(`/api/v1/events/${id}`);
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        isDeletingEvent: false,
      }));
      toast.success("Evento eliminado con éxito");
    } catch (error) {
      set({ isDeletingEvent: false });
      // toast.error(error.response?.data?.message || "Error al eliminar el evento");
    }
  },
  toggleLike: async (eventId) => {
    const { event } = get(); // Obtener el evento actual del estado
    const user = useAuthStore.getState().user; // Obtener el usuario autenticado

    if (!user) {
      toast.error("Debes iniciar sesión para dar like."); // Muestra la notificación
      return;
    }

    const hasLiked = event.likedBy.includes(user._id);
    const updatedLikedBy = hasLiked
      ? event.likedBy.filter((id) => id !== user._id)
      : [...event.likedBy, user._id];

    set({
      event: {
        ...event,
        likedBy: updatedLikedBy,
        likesCount: hasLiked ? event.likesCount - 1 : event.likesCount + 1,
      },
    });

    try {
      await axios.put(`/api/v1/event/events/${eventId}/like`);
    } catch (error) {
      console.error("Error al actualizar el like", error);
      set({ event });
    }
  },

  getMapData: async (address) => {
    set({ isFetchingMapData: true });
    try {
      const response = await axios.get(
        `/api/v1/maps/geocode?address=${encodeURIComponent(address)}`
      );

      if (response.data.lat && response.data.lng) {
        const location = { lat: response.data.lat, lng: response.data.lng };
        set({ mapData: location, isFetchingMapData: false });
        return location;
      } else {
        throw new Error("No se encontraron resultados para la direccion");
      }
    } catch (error) {
      set({ isFetchingMapData: false });
      toast.error("Error al buscar la informacion", error);
      throw error;
    }
  },

  // Funcion para obtener las coordenadas segun el evento
  getEventCoordinates: async (eventId) => {
    try {
      const response = await axios.get(
        `/api/v1/maps/event/${eventId}/coordinates`
      );
      set({ coordinates: response.data.coordinates });
    } catch (error) {
      toast.error("Error al obtener las coordenadas del evento", error);
    }
  },
}));
