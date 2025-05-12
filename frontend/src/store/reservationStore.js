import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useReservationStore = create((set, get) => ({
  isBooking: false,
  isLoading: false,
  isDeletingEvent: false,
  eventToDelete: null,
  setEventToDelete: (id) => set({ eventToDelete: id }),
  clearEventToDelete: () => set({ eventToDelete: null }),
  reservations: [],

  // Funcion para crear la reserva
  createReservation: async (eventId, selectedDate, selectedSchedule) => {
    set({ isBooking: true });
    try {
      // Realizamos la solicitus al backend
      const response = await axios.post("/api/v1/reservation/reserve", {
        eventId,
        eventDate: selectedDate,
        eventSchedule: selectedSchedule,
      });
      // Si la reserva es exitosa, actualizamos el estado
      set({ isBooking: false });

      // Guardamos la nueva reserva en el estado de reservations
      set((state) => ({
        reservations: [...state.reservations, response.data.reservations],
      }));
      toast.success("Reserva realizada con éxito");
    } catch (error) {
      set({ isBooking: false });
      toast.error(
        error.response?.data?.message || "Error al realizar la reserva"
      );
    }
  },

  // Funcion para obtener las resercaiones de un usuario
  getUserReservations: async () => {
    set({ isLoading: true });
    try {
      // Hacemos la solicitud al backend
      const response = await axios.get("/api/v1/reservation/user-reservations");

      // Actualizamos el estado con las reservas del usuario
      set({
        reservations: response.data.reservations,
        isLoading: false,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al obtener las reservas"
      );
      set({ isLoading: false });
    }
  },

  // Funcion para eliminar una reservacion
  deleteEvent: async () => {
    const state = get();
    const { eventToDelete } = state;

    if (!eventToDelete) return;

    set({ isDeletingEvent: true });

    try {
      await axios.delete(`/api/v1/reservation/${eventToDelete}`);
      set({
        reservations: state.reservations.filter(
          (reservation) => reservation._id !== eventToDelete
        ),
        eventToDelete: null,
      });
      toast.success("Reserva eliminada con éxito");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al eliminar la reserva"
      );
    } finally {
      set({ isDeletingEvent: false });
    }
  },
}));
