import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./authUser";

export const useEventStore = create((set, get) => ({
  events: [],
  popularEvents: [],
  userEvents: [],
  eventUserLikes: [],
  eventsByCategory: {},
  categories: [],
  event: null,
  eventToDelete: null,
  isCreatingEvent: false,
  isUpdatingEvent: false,
  isLoadingEvents: true,
  isLoadingCategories: false,
  isFetchingEvent: false,
  isDeletingEvent: false,

  setEvents: (newEvents) => set({ events: newEvents }),
  setEventToDelete: (id) => set({ eventToDelete: id }),
  clearEventToDelete: () => set({ eventToDelete: null }),
  setIsDeletingdEvent: (status) => set({ isDeletingEvent: status }),

  createEvent: async (eventData) => {
    set({ isCreatingEvent: true });
    try {
      const response = await axios.post(
        "/api/v1/event/create-event",
        eventData
      );
      set((state) => ({
        events: [...state.events, response.data.event],
        isCreatingEvent: false,
      }));
      toast.success("Evento creado con éxito");
      return response.data.event;
    } catch (error) {
      set({ isCreatingEvent: false });
      toast.error(error.response?.data?.message || "Error al crear el evento");
      return null;
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

  getPopularEvents: async () => {
    set({ isLoadingEvents: true });
    try {
      const response = await axios.get("/api/v1/event/popular-events");
      set({ popularEvents: response.data, isLoadingEvents: false });
    } catch (error) {
      set({ isLoadingEvents: false });
      toast.error(
        error.response?.data?.message || "Error al cargar los eventos populares"
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

  updateEvent: async (eventId, updatedEventData) => {
    set({ isUpdatingEvent: true });
    try {
      const response = await axios.put(
        `/api/v1/event/events/${eventId}`,
        updatedEventData
      );
      set({ isUpdatingEvent: false });
      toast.success("Evento actualizado con éxito");
      return response.data.event;
    } catch (error) {
      set({ isUpdatingEvent: false });
      toast.error(
        error.response?.data?.message || "Error al actualizar el evento"
      );
    }
  },

  deleteEvent: async () => {
    const state = get(); // Obtenemos el estado actual
    const { eventToDelete } = state;

    if (!eventToDelete) return;

    set({ isDeletingEvent: true });
    try {
      await axios.delete(`/api/v1/event/events/${eventToDelete}`);
      set({
        events: state.events.filter((event) => event._id !== eventToDelete),
        eventToDelete: null, // Limpia el evento seleccionado
      });
      toast.success("Evento eliminado con éxito");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al eliminar el evento"
      );
    } finally {
      set({ isDeletingEvent: false });
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

  getEventsBySearch: async (query) => {
    if (!query.trim()) return;

    set({ isLoadingEvents: true });
    try {
      const response = await axios.get(`/api/v1/event/search?query=${query}`);
      set({ events: response.data.events || [], isLoadingEvents: false });
    } catch (error) {
      set({ isLoadingEvents: false });
      toast.error(error.response?.data?.message || "Error al buscar eventos");
    }
  },

  getUserEvents: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/v1/event/user/${userId}`);
      set({ userEvents: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Error al obtener eventos");
    }
  },

  getUserLikedEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/api/v1/event/liked-events");

      set({ eventUserLikes: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Error al obtener eventos likeados"
      );
    }
  },
}));
