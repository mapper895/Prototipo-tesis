import Notification from "../models/notification.model.js";
import {
  notifyEventEnded,
  notifyReservationsForTomorrow,
  sendEventReminder,
  sendWeeklyEvents,
} from "../utils/notificationService.js";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import moment from "moment";

// Obtener notificaciones de un usuario
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 }); // Ordenar por la fecha más reciente
    //.populate("eventId"); // Obtener los detalles del evento asociado

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    //console.error("Error al obtener las notificaciones:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener las notificaciones" });
  }
};

// Crear y enviar notificaciones para la reserva de eventos que son el dia de mañana
export const runNotifyReservationsManually = async (req, res) => {
  try {
    const notification = await notifyReservationsForTomorrow();
    res
      .status(200)
      .json({ message: "Notificaciones enviadas correctamente", notification });
  } catch (error) {
    console.log("Error enviando notificaciones manualmente", error);
    res.status(500).json({ error: "Error enviando notificaciones" });
  }
};

// Marcar una notificación como leída
export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }

    notification.read = true; // Marcamos como leída
    await notification.save();

    res
      .status(200)
      .json({ success: true, message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    res.status(500).json({
      success: false,
      message: "Error al marcar la notificación como leída",
    });
  }
};

// Reusamos la logica para obtener eventos destacados de la semana
const getWeeklyFeaturedEvents = async () => {
  const now = new Date();
  const lastTuesday = new Date(now);
  lastTuesday.setDate(now.getDate() - 7);

  // Obtenemos todos los eventos con fechas definidas
  const allEvents = await Event.find({
    dates: { $exists: true, $ne: [] },
  }).lean();

  // Filtramos eventos cuyo primer fecha este entre el martes pasado y hoy
  const filteredEvents = allEvents.filter((event) => {
    const [day, month, year] = event.dates[0].split("/");
    const eventDate = new Date(year, month - 1, day);

    return eventDate >= lastTuesday && eventDate <= now;
  });

  // Ordenamos eventos por views descendiente y tomar los primeros 4
  const top4Events = filteredEvents
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return top4Events;
};

// Funcion para enviar correos con los eventos destacados de la semana
export const sendWeeklyEventSummary = async (req, res) => {
  try {
    const events = await getWeeklyFeaturedEvents();

    if (events.lenth === 0) {
      return res
        .status(200)
        .json({ message: "No hay eventos destacados esta semana" });
    }

    const users = await User.find();

    for (const user of users) {
      await sendWeeklyEvents(user.email, events);
    }

    return res
      .status(200)
      .json({ message: "Correos semanales enviados correctamente" });
  } catch (error) {
    console.log("Error al enviar resumen semanal: ", error);
    res.status(500).json({ error: "Error al enviar resumen semanal" });
  }
};

// Funcion para enviar correos con los eventos finalizados
export const runNotifyEventEndedManually = async (req, res) => {
  try {
    await notifyEventEnded();
    res.status(200).json({
      message: "Notificaciones de eventos terminado enviadas correctamente",
    });
  } catch (error) {
    console.log("Error ejecutando notifyEventEnded manualmente: ", error);
    res
      .status(500)
      .json({ error: "Error al enviar notificaciones de eventos terminados" });
  }
};

// Funcion para enviar correos de recordatorio al creador del evento de los eventos que empiezan mañana
export const sendReminder = async (req, res) => {
  try {
    const tomorrow = moment().add(1, "day").format("DD/MM/YYYY");

    const events = await Event.find({ reminderSent: { $ne: true } }).populate(
      "createdBy"
    );

    for (const event of events) {
      if (!event.dates || event.dates.length === 0) continue;

      const firstDate = event.dates[0];
      if (firstDate !== tomorrow) continue;

      const creator = event.createdBy;
      if (!creator || creator.username === "admin") continue;

      await sendEventReminder(creator.email, event, creator.username);
      await Event.findByIdAndUpdate(event._id, { reminderSent: true });

      res.status(200).json({
        message: "Recordatorioa enviados correctamente a los creadores",
      });
    }
  } catch (error) {
    console.log("Error en sendReminders: ", error);
    res.status(500).json({ message: "Error al enviar recordatorios" });
  }
};
