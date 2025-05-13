import cron from "node-cron";
import {
  createEventReminderNotifications,
  createSimilarEventNotifications,
} from "./notificationService.js";

export const scheduleNotification = () => {
  // Programar la tarea para enviar recordatorios de eventos próximos todos los días a medianoche
  cron.schedule("0 0 * * *", createEventReminderNotifications); // Ejecuta todos los días a las 00:00

  // Programar la tarea para enviar notificaciones de eventos similares (puedes cambiar la frecuencia de la tarea según lo necesites)
  cron.schedule("0 0 * * *", createSimilarEventNotifications); // Ejecuta todos los días a las 00:00

  createEventReminderNotifications();
};
