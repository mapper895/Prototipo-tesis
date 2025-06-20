import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const useFeedbackStore = create((set) => ({
  comment: "",
  successMessage: "",
  errorMessage: "",
  feedback: null, // Para almacenar el feedback de un usuario
  feedbackGiven: false, // Para verificar si el usuario ya dio feedback
  feedbackData: {
    averageRating: 0,
    totalRatings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    totalFeedbacks: 0,
  },
  loadingFeedback: false,
  isSubmitting: false,
  setFeedback: (feedback) => set({ feedback }), // Guardar feedback
  setFeedbackGiven: (status) => set({ feedbackGiven: status }), // Establecer si el usuario ya dio feedback
  setCommentData: (newData) => set((state) => ({ ...state, ...newData })),

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

  getFeedbackData: async () => {
    set({ loadingFeedback: true });
    try {
      const response = await axios.get("/api/v1/feedback/rating");
      const data = response.data;

      set({ feedbackData: data, loadingFeedback: false });
    } catch (error) {
      set({ loadingFeedback: false });
    }
  },

  sendComment: async (commentData) => {
    set({ isSubmitting: true, successMessage: "", errorMessage: "" });
    try {
      const response = await axios.post(
        "/api/v1/feedback/send-comment",
        commentData
      );

      if (response.data.success) {
        set({
          successMessage: "Comentario enviado con éxito",
          isSubmitting: false,
        });
      } else {
        set({
          errorMessage: "Error al enviar el comentario. Intenta nuevamente",
          isSubmitting: false,
        });
      }
    } catch (error) {
      set({
        errorMessage: "Error al enviar el comentario. Intenta nuevamente",
        isSubmitting: false,
      });
    }
  },
}));
