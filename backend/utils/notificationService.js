import Reservation from "../models/reservation.model.js";
import Notification from "../models/notification.model.js";
import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "./emailService.js";
import moment from "moment"; // Para facilitar el manejo de fechas

// Enviar correo de bienvenida al crear un usuario nuevo
export const sendWelcomeEmail = async (userEmail) => {
  const subject = "Bienvenido a Nuetra App";
  const html = `
    <h2>¡Gracias por registrarte!</h2>
    <p>Esperamos que disfrutes nuestra plataforma.</p>
  `;
  return sendEmail(userEmail, subject, null, html);
};

// Funcion para formatear las fechas
const formatDateSpanish = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day);

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const nombreDia = dias[date.getDay()];
  const numeroDia = date.getDate();
  const nombreMes = meses[date.getMonth()];

  return `${nombreDia} ${numeroDia} de ${nombreMes}`;
};

// Enviar recordatorio de evento próximo al creador del evento
export const sendEventReminder = async (userEmail, event) => {
  const subject = `Recordatorio: Evento próximo - ${event.title}`;

  const dates = event.dates || [];
  const firstDate = dates[0] || "";
  const lastDate = dates.length > 1 ? dates[dates.length - 1] : firstDate;

  const firstDateFormatted = formatDateSpanish(firstDate);
  const lastDateFormatted = formatDateSpanish(lastDate);
  const text = `Hola, tu evento "${event.title}" está programado del ${firstDateFormatted} al ${lastDateFormatted}. ¡No lo olvides!`;

  return sendEmail(userEmail, subject, text);
};

//Enviar resumen semanal de eventos destacados
export const sendWeeklyEvents = async (userEmail, events) => {
  const subject = "Eventos Destacados de la Semana";

  // Creamos lista HTML con los enlace a los eventos
  const eventListHtml = events
    .map((e) => {
      const url = `http://localhost:5173/events/${e._id}`;
      const firstDate = e.dates && e.dates.length > 0 ? e.dates[0] : "";
      const formattedDate = firstDate
        ? formatDateSpanish(firstDate)
        : "Fecha no disponible";

      return `<li><a href="${url}" target="_blank" style="color:blue; rext-decoration:underline;">${e.title} - ${formattedDate} </a></li>`;
    })
    .join("");

  const html = `<p>Hola, estos son los eventos destacados de esta semana: </p>
    <ul>
    ${eventListHtml}
    </ul>
    <p>¡No te los pierdas!</p>`;

  //Envioamos el correo usando la propiedad 'html'
  return sendEmail(userEmail, subject, null, html);
};

// Crear y enviar notificaciones para la reserva de eventos que son el dia de mañana
export const notifyReservationsForTomorrow = async () => {
  const tomorrowDate = moment().add(1, "day").format("DD/MM/YYYY");

  // Buscamos reservas cuyo eventDate sea mañana
  const reservations = await Reservation.find({ eventDate: tomorrowDate })
    .populate("userId")
    .populate("eventId");

  const notificationsCreated = [];

  for (const reservation of reservations) {
    const user = reservation.userId;
    const event = reservation.eventId;

    if (!user || !event) continue; // Por si hay referencias incompletas

    const message = `El dia de mañana es el evento - ${event.title} -. ¡No lo olvides!`;

    // Creamos notificacione en BD
    const notification = new Notification({
      userId: user._id,
      message,
      eventId: event._id,
    });
    await notification.save();

    // Enviar correo recordatorio
    await sendEmail(
      user.email,
      `Recordatorio: Evento - ${event.title}`,
      message
    );

    // Guardamos datos para devolverlos después
    notificationsCreated.push({
      notificationId: notification._id,
      userEmail: user.email,
      eventTitle: event.title,
      message,
    });
  }

  return notificationsCreated;
};

// Funcion para obtener los eventos mas destacados de la semana
export const getWeeklyFeaturedEvents = async () => {
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

// Funcion para enviar correo con los detalles de una nueva reservacion
export const sendReservationConfirmationEmail = async (
  userEmail,
  reservation,
  event
) => {
  const eventDateFormatted = formatDateSpanish(reservation.eventDate);

  const subject = `Confirmacion de reservación para ${event.title}`;

  const html = `<h2>Reserva confirmada</h2>
    <p>Gracias por reservar en nuestro sistema. Aquí los detalles de tu reservación:</p>
    <ul>
      <li><strong>Evento:</strong> ${event.title}</li>
      <li><strong>Fecha:</strong> ${eventDateFormatted}</li>
      <li><strong>Horario:</strong> ${reservation.eventSchedule}</li>
      <li><strong>Ubicación:</strong> ${event.location}</li>
    </ul>
    <p>¡Te esperamos!</p>
    <img src="${event.imageUrl}" alt="Imagen del evento" style="width:300px;"/>`;

  return sendEmail(userEmail, subject, null, html);
};

// Funcion para enviar correo al crear/actualizar evento
export const sendEventNotificationEmail = async (
  userEmail,
  event,
  action = "creado"
) => {
  // Usamos action para diferenciar si es creacion o actualizacion
  const firstDate = event.dates && event.dates.length > 0 ? event.dates[0] : "";
  const formattedDate = firstDate
    ? formatDateSpanish(firstDate)
    : "Fecha no disponible";

  const subject = `Evento ${action}: ${event.title}`;

  const html = `<h2>Evento ${action} exitosamente</h2>
    <p>Detalles del evento:</p>
    <ul>
      <li><strong>Título:</strong> ${event.title}</li>
      <li><strong>Fecha inicio:</strong> ${formattedDate}</li>
      <li><strong>Ubicación:</strong> ${event.location}</li>
      <li><strong>Descripción:</strong> ${event.description}</li>
    </ul>
    <img src="${event.imageUrl}" alt="Imagen del evento" style="width:300px;"/>`;

  return sendEmail(userEmail, subject, null, html);
};

// Funcion para detectar eventos terminados y enviar correo
export const notifyEventEnded = async () => {
  const today = moment().startOf("day");

  // Buscamos todos los eventos que ya terminaron (ultima fecha < hoy)
  const endedEvents = await Event.find({ endedNotificationSent: false }).lean();

  for (const event of endedEvents) {
    if (!event.dates || event.dates.length === 0) continue;

    // Obtener ultima fecha del arreglo y parsear
    const lastDateStr = event.dates[event.dates.length - 1];
    const lastDate = moment(lastDateStr, "DD/MM/YYYY").startOf("day");

    // Si el evento termino antes de hoy
    if (lastDate.isBefore(today)) {
      // Obtener creador
      const creator = await User.findById(event.createdBy);

      if (!creator) continue;

      // Exceptuar admin
      if (creator.username === "admin") continue;

      const reservationCount = await Reservation.countDocuments({
        eventId: event._id,
      });

      // Preparar datos para el correo
      const subject = `Resumen: Evento terminado - ${event.title}`;
      const html = `
      <h2>Tu evento "${event.title}" ha terminado</h2>
        <p><strong>Descripción:</strong> ${event.description}</p>
        <p><strong>Fechas:</strong> ${event.dates.join(", ")}</p>
        <p><strong>Vistas:</strong> ${event.views || 0}</p>
        <p><strong>Likes:</strong> ${event.likesCount || 0}</p>
        <p><strong>Reservas totales:</strong> ${reservationCount}</p>
        <p>Gracias por utilizar nuestra plataforma.</p>
      `;

      // Enviar correo
      await sendEmail(creator.email, subject, null, html);

      // Marcamos que ya se envio la notificacion
      await Event.findByIdAndUpdate(event._id, { endedNotificationSent: true });
    }
  }
};
