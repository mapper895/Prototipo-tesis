import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigninUp: false,
  isCheckingAuth: true,
  isLogginOut: false,
  isLogginIn: false,
  isLoading: false,
  categories: [],
  onboarded: false,

  signup: async (credentials) => {
    set({ isSigninUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigninUp: false });
      toast.success("Cuenta creada con éxito");

      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Ocurrio un error");
      set({ isSigninUp: false, user: null });
    }
  },

  login: async (credentials) => {
    set({ isLogginIn: true });
    try {
      const response = await axios.post("/api/v1/auth/login", credentials);
      set({ user: response.data.user, isLogginIn: false });
    } catch (error) {
      set({ isLogginIn: false });
      toast.error(error.response.data.message || "Fallo al inicio de sesión");
    }
  },

  logout: async () => {
    set({ isLogginOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLogginOut: false });
      toast.success("Sesión cerrada con éxito");
    } catch (error) {
      set({ isLogginOut: false });
      toast.error(error.response.data.message || "Fallo al cierre de sesión");
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/api/v1/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ isCheckingAuth: false, user: null });
      // toast.error(error.response.data.message || "Ocurrio un error");
    }
  },

  updatePreferences: async (preferences) => {
    try {
      set({ isLoading: true });
      const response = await axios.post("/api/v1/auth/preferences", {
        preferences,
      });

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "Ocurrio un error");
    }
  },

  setUserId: (id) => set({ userId: id }),

  generateRecommendations: async () => {
    set({ isLoading: true });
    try {
      await axios.get(
        "/api/v1/recommendation/user-recommendations-by-preferences"
      );
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "Ocurrio un error");
    }
  },
}));
