import Reservation from "../models/reservation.model.js";
import Notification from "../models/notification.model.js";
import { Event } from "../models/event.model.js";
import moment from "moment"; // Para facilitar el manejo de fechas

// Función para crear notificaciones de eventos próximos
export const createEventReminderNotifications = async () => {
  try {
    // Obtenemos la fecha de mañana
    const tomorrow = moment().add(1, "days").startOf("day");

    // Buscamos todas las reservas cuyo evento es mañana
    const reservations = await Reservation.find({
      eventDate: tomorrow.format("YYYY-MM-DD"), // Fecha del evento
    }).populate("eventId");

    // Creamos una notificación para cada reserva
    reservations.forEach(async (reservation) => {
      const message = `Mañana es el evento: "${reservation.eventId.title}" que reservaste para el ${reservation.eventDate} a las ${eventSchedule}.`;
      const notification = new Notification({
        userId: reservation.userId,
        message: message,
        eventId: reservation.eventId._id,
      });

      await notification.save(); // Guardamos la notificación
    });
  } catch (error) {
    console.error("Error al crear notificaciones de evento próximo:", error);
  }
};

// Funcion para crear notificaciones sin importar la fecha
// export const createEventReminderNotifications = async () => {
//   try {
//     // Obtenemos todas las reservas de la base de datos
//     const reservations = await Reservation.find().populate("eventId userId");

//     // Creamos una notificación para cada reserva
//     for (const reservation of reservations) {
//       const user = reservation.userId; // Usuario que hizo la reserva
//       const event = reservation.eventId; // Evento asociado a la reserva
//       const eventDate = reservation.eventDate; // Fecha del evento
//       const eventSchedule = reservation.eventSchedule; // Horario del evento

//       // Generar el mensaje de la notificación. Puedes personalizarlo
//       const message = `Tienes una reserva para el evento: ${event.title} que será el ${eventDate} a las ${eventSchedule}.`;

//       // Crear y guardar la notificación en la base de datos
//       const notification = new Notification({
//         userId: user._id,
//         message: message,
//         eventId: event._id,
//       });

//       await notification.save(); // Guardar la notificación en la base de datos

//       console.log(`Notificación enviada a ${user.username}: ${message}`);
//     }
//   } catch (error) {
//     console.error("Error al crear notificaciones de reservas:", error);
//   }
// };

// Función para crear notificaciones de eventos similares
export const createSimilarEventNotifications = async () => {
  try {
    // Obtener todas las reservas realizadas por los usuarios
    const reservations = await Reservation.find().populate("eventId");

    reservations.forEach(async (reservation) => {
      const event = reservation.eventId;

      // Buscar eventos de la misma categoría
      const similarEvents = await Event.find({
        category: event.category,
        _id: { $ne: event._id }, // Excluimos el evento original
      });

      similarEvents.forEach(async (similarEvent) => {
        const message = `Podría gustarte - ${similarEvent.title} - evento similar al que reservaste.`;
        const notification = new Notification({
          userId: reservation.userId,
          message: message,
          eventId: similarEvent._id,
        });

        await notification.save(); // Guardamos la notificación
      });
    });
  } catch (error) {
    console.error("Error al crear notificaciones de eventos similares:", error);
  }
};
