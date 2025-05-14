import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  isLoading: false,

  getUserNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/api/v1/notification");

      set({ notifications: response.data.notifications, isLoading: false });
    } catch (error) {
      //   toast.error(
      //     error.response?.data?.message || "Error al obtener las notificacions"
      //   );
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const reponse = await axios.put(
        `/api/v1/notification/read/${notificationId}`
      );

      if (reponse.data.success) {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        }));
      }
    } catch (error) {
      toast.error(error.reponse?.data?.message || "Error con la notificacion");
    }
  },
}));
