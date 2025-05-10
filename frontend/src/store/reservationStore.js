import axios from "axios";
import toast from "react-hot-toast";

export const createReservation = async (
  eventId,
  selectedDate,
  selectedSchedule
) => {
  try {
    const response = await axios.post("/api/v1/reservation/reserve", {
      eventId,
      eventDate: selectedDate,
      eventSchedule: selectedSchedule,
    });

    console.log("Reserva realizada", response.data);

    toast.success("Reserva realizada con éxito.");
  } catch (error) {
    console.log("Error al realizar la reserva: ", error);
    toast.error(
      error.response?.data?.message || "Error al realizar la reserva"
    );
  }
};
