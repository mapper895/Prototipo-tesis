import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useReservationStore = create((set) => ({
  isBooking: false,
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
}));
