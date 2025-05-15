import cron from "node-cron";
import { User } from "../models/user.model.js";
import {
  sendWeeklyEvents,
  getWeeklyFeaturedEvents,
  notifyReservationsForTomorrow,
  notifyEventEnded,
} from "./notificationService.js";

// Envia los eventos destacados de la semana
cron.schedule("0 8 * * 2", async () => {
  // Cada martes a las 8am
  try {
    const events = await getWeeklyFeaturedEvents();

    if (events.length === 0) {
      console.log("No hay eventos destacados esta semana.");
      return;
    }

    const users = await User.find();

    for (const user of users) {
      await sendWeeklyEvents(user.email, events);
    }

    console.log("Correos semanales enviados correctamente");
  } catch (error) {
    console.log("Error en cron job de eventos destacados: ", error);
  }
});

// Obtiene y envia notificaciones sobre las reservas de los eventos que son el dia de mañana
cron.schedule("0 8 * * *", async () => {
  //Diaramente a las 8AM
  console.log("Ejecutando cron para notificar reservas de eventos de mañana");
  try {
    await notifyReservationsForTomorrow();
    console.log("Notificaciones y correos enviados correctamente");
  } catch (error) {
    console.log("Error enviando notificaciones");
  }
});

// Envia correos notificando eventos terminados
cron.schedule("0 9 * * *", async () => {
  console.log("Ejecutando cron para notificar eventos terminados");
  try {
    await notifyEventEnded();
    console.log("Correos de eventos terminados enviados");
  } catch (error) {
    console.log("Error notificando eventos terminados");
  }
});
