import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const useFeedbackStore = create((set) => ({
  feedback: null, // Para almacenar el feedback de un usuario
  feedbackGiven: false, // Para verificar si el usuario ya dio feedback
  setFeedback: (feedback) => set({ feedback }), // Guardar feedback
  setFeedbackGiven: (status) => set({ feedbackGiven: status }), // Establecer si el usuario ya dio feedback

  // Funcion para enviar el feedback
  submitFeedback: async (rating) => {
    try {
      const response = await axios.post("/api/v1/feedback/submit", { rating });

      // Si se guarda correctamente el feedback, actualizamos
      set({ feedback: response.data.feedback, feedbackGiven: true });
      toast.success("Feedback enviado con éxito");
    } catch (error) {
      console.log("Error al enciar el feedback", error);
      toast.error(
        error.response?.data?.message || "Error al enviar tu feedback."
      );
    }
  },
}));
