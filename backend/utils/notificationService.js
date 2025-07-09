import Reservation from "../models/reservation.model.js";
import Notification from "../models/notification.model.js";
import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "./emailService.js";
import moment from "moment"; // Para facilitar el manejo de fechas

// Enviar correo de bienvenida al crear un usuario nuevo
export const sendWelcomeEmail = async (userEmail, username) => {
  const subject = "Bienvenido a Nuetra App";
  const html = `
     <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #001f60;">¡Hola ${username}!</h2>
      <p>Gracias por registrarte en nuestra plataforma de eventos.</p>

      <p>Aquí puedes:</p>
      <ul>
        <li>Explorar y agendar eventos culturales en la CDMX.</li>
        <li>Guardar tus eventos favoritos para más tarde.</li>
        <li>Recibir recomendaciones personalizadas según tus intereses.</li>
      </ul>

      <p>Empieza ahora mismo:</p>
      <a href="https://tesis-app-7sij.onrender.com" 
         style="display: inline-block; background-color: #001f60; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
         Ir a la plataforma
      </a>

      <hr style="margin: 30px 0;">
      <p style="font-size: 14px; color: #777;">
        ¿Necesitas ayuda? Escríbenos a <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.<br>
        ¡Nos alegra tenerte con nosotros!
      </p>
    </div>
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
export const sendEventReminder = async (userEmail, event, username) => {
  const subject = `Recordatorio: Evento próximo - ${event.title}`;

  const dates = event.dates || [];
  const firstDate = dates[0] || "";
  const lastDate = dates.length > 1 ? dates[dates.length - 1] : firstDate;

  const firstDateFormatted = formatDateSpanish(firstDate);
  const lastDateFormatted = formatDateSpanish(lastDate);
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #001f60;">¡Hola ${username}!</h2>

    <p>Te recordamos que tu evento <strong>"${
      event.title
    }"</strong> está próximo a iniciar.</p>

    <div style="background-color: #F3F4F6; padding: 10px 15px; border-radius: 5px; margin-bottom: 15px;">
      <p><strong>📅 Fechas:</strong> del ${firstDateFormatted} al ${lastDateFormatted}</p>
      <p><strong>📍 Lugar:</strong> ${event.location}</p>
      ${
        event.schedules && event.schedules.length > 0
          ? `<p><strong>🕐 Horarios:</strong> ${event.schedules.join(", ")}</p>`
          : ""
      }
    </div>

    ${
      event.description
        ? `<p style="margin-bottom: 15px;"><strong>Descripción:</strong> ${event.description}</p>`
        : ""
    }

    ${
      event.imageUrl
        ? `<img src="${event.imageUrl}" alt="Imagen del evento" style="width:100%; max-width:500px; border-radius: 8px; margin-bottom: 20px;" />`
        : ""
    }

    ${
      event._id
        ? `<a href="https://tesis-app-7sij.onrender.com/events/${event._id}" 
            style="display: inline-block; background-color: #001f60; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-bottom: 20px;">
            Ver evento
          </a>`
        : ""
    }

    <hr style="margin: 30px 0;">
    <p style="font-size: 14px; color: #777;">
      ¿Tienes dudas o necesitas hacer cambios? Escríbenos a 
      <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.
    </p>
  </div>
`;

  return sendEmail(userEmail, subject, null, html);
};

//Enviar resumen semanal de eventos destacados
export const sendWeeklyEvents = async (userEmail, events) => {
  const subject = "🗓️ Tu cartelera semanal - Eventos destacados";

  // Creamos lista HTML con los enlace a los eventos
  const eventListHtml = events
    .map((e) => {
      const url = `https://tesis-app-7sij.onrender.com/events/${e._id}`;
      const firstDate = e.dates?.[0] || "";
      const lastDate =
        e.dates.length > 1 ? e.dates[e.dates.length - 1] : firstDate;

      const lastDateFormatted = lastDate
        ? formatDateSpanish(lastDate)
        : "Fecha no disponible";
      const firstFormattedDate = firstDate
        ? formatDateSpanish(firstDate)
        : "Fecha no disponible";
      const imageUrl = e.imageUrl || "";
      const description = e.description
        ? e.description.slice(0, 200) + "..."
        : "Sin descripción disponible.";

      return `
        <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">
          <img src="${imageUrl}" alt="Imagen del evento" style="width: 100%; height: auto; display: block;" />
          <div style="padding: 15px;">
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #001f60;">${e.title}</h3>
            <p style="margin: 0 0 10px;"><strong>📅 Fecha:</strong> del ${firstFormattedDate} al ${lastDateFormatted}</p>
            <p style="margin: 0 0 15px; line-height: 1.5; color: #444;">${description}</p>
            <a href="${url}" target="_blank"
               style="display: inline-block; background-color: #001f60; color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none;">
              Ver evento
            </a>
          </div>
        </div>
      `;
    })
    .join("");

  const html = `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #001f60;">🎉 Eventos recomendados para ti esta semana</h2>
      <p>Te compartimos algunos eventos destacados que podrían interesarte:</p>

      ${eventListHtml}

      <p style="text-align: center; margin-top: 30px;">¿Quieres ver más?</p>
      <div style="text-align: center;">
        <a href="https://tesis-app-7sij.onrender.com" 
           style="display: inline-block; background-color: #001f60; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
           Explorar todos los eventos
        </a>
      </div>

      <hr style="margin: 40px 0;">
      <p style="font-size: 14px; color: #777;">
        ¿Tienes preguntas o sugerencias? Contáctanos en 
        <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.
      </p>
    </div>`;

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

    const formattedDate = formatDateSpanish(reservation.eventDate);
    const message = `El dia de mañana es el evento - ${event.title} -. ¡No lo olvides!`;

    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #001f60;">📌 ¡Tienes un evento agendado para mañana!</h2>

    <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 20px 0;">
      <img src="${event.imageUrl || ""}" 
           alt="Imagen del evento" style="width: 100%; height: auto; display: block;" />
      <div style="padding: 15px;">
        <h3 style="margin: 0 0 10px; color: #001f60;">${event.title}</h3>
        <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
        <p><strong>🕒 Horario:</strong> ${reservation.eventSchedule}</p>
        <p style="margin-top: 10px;">¡Prepárate para disfrutarlo!</p>
        <a href="https://tesis-app-7sij.onrender.com/events/${event._id}" 
           style="display: inline-block; background-color: #001f60; color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none;">
          Ver detalles del evento
        </a>
      </div>
    </div>

    <p style="font-size: 14px; color: #777;">
      Si tienes preguntas, contáctanos en <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.
    </p>
  </div>
`;

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
      `⏰ Recordatorio: Tu evento "${event.title}" es mañana`,
      null,
      html
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
  const eventUrl = `https://tesis-app-7sij.onrender.com/events/${event._id}`;
  const imageUrl = event.imageUrl || "";

  const subject = `🎟️ Confirmación de evento agendado - "${event.title}"`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #001f60;">✅ ¡Tu evento está agendado!</h2>
      <p>Aquí están los detalles de tu evento:</p>

      <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 20px 0;">
        <img src="${imageUrl}" alt="Imagen del evento" style="width: 100%; height: auto; display: block;" />
        <div style="padding: 15px;">
          <h3 style="margin: 0 0 10px; color: #001f60;">${event.title}</h3>
          <p><strong>📅 Fecha:</strong> ${eventDateFormatted}</p>
          <p><strong>🕒 Horario:</strong> ${reservation.eventSchedule}</p>
          <p><strong📍> Ubicación:</strong> ${event.location}</p>

          <a href="${eventUrl}" target="_blank"
             style="display: inline-block; background-color: #001f60; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px;">
            Ver evento
          </a>
        </div>
      </div>

      <p style="margin-top: 20px;">¡Esperamos que lo disfrutes!</p>

      <hr style="margin: 40px 0;">
      <p style="font-size: 14px; color: #777;">
        ¿Tienes preguntas o necesitas modificar tu evento agendado? Escríbenos a 
        <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.
      </p>
    </div>
  `;

  return sendEmail(userEmail, subject, null, html);
};

// Funcion para enviar correo al crear/actualizar evento
export const sendEventNotificationEmail = async (
  userEmail,
  event,
  action = "creado"
) => {
  const dates = event.dates || [];
  const firstDate = dates[0] || "";
  const lastDate = dates.length > 1 ? dates[dates.length - 1] : firstDate;

  const formattedFirstDate = firstDate ? formatDateSpanish(firstDate) : "";
  const formattedLastDate =
    lastDate && lastDate !== firstDate ? formatDateSpanish(lastDate) : null;

  const subject = `📢 Evento ${action}: ${event.title}`;
  const imageUrl =
    event.imageUrl || "https://via.placeholder.com/600x300?text=Evento";
  const eventUrl = `https://tesis-app-7sij.onrender.com/events/${event._id}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #001f60;">✅ Evento ${action} exitosamente</h2>
      <p>Tu evento ha sido ${
        action === "actualizado" ? "actualizado" : "creado"
      } correctamente. Aquí están los detalles:</p>

      <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 20px 0;">
        <img src="${imageUrl}" alt="Imagen del evento" style="width: 100%; height: auto; display: block;" />
        <div style="padding: 15px;">
          <h3 style="color: #001f60;">${event.title}</h3>
          
          ${
            formattedFirstDate
              ? `<p><strong>📅 Fecha de inicio:</strong> ${formattedFirstDate}</p>`
              : ""
          }
          ${
            formattedLastDate
              ? `<p><strong>📅 Fecha de fin:</strong> ${formattedLastDate}</p>`
              : ""
          }

          ${
            event.schedules?.length
              ? `<p><strong>🕒 Horarios:</strong> ${event.schedules.join(
                  ", "
                )}</p>`
              : ""
          }

          ${
            event.location
              ? `<p><strong>📍 Ubicación:</strong> ${event.location}</p>`
              : ""
          }

          ${
            event.category
              ? `<p><strong>🎨 Categoría:</strong> ${event.category}</p>`
              : ""
          }

          ${
            event.description
              ? `<p><strong>📝 Descripción:</strong><br>${event.description}</p>`
              : ""
          }

          <a href="${eventUrl}" target="_blank"
             style="display: inline-block; background-color: #001f60; color: white; padding: 10px 16px; border-radius: 5px; text-decoration: none; margin-top: 10px;">
            Ver evento en la plataforma
          </a>
        </div>
      </div>

      <hr style="margin: 40px 0;">
      <p style="font-size: 14px; color: #777;">
        ¿Tienes preguntas o necesitas ayuda? Contáctanos en 
        <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.
      </p>
    </div>
  `;

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
      const firstDate = event.dates[0];
      const lastDate = event.dates[event.dates.length - 1];
      const formattedFirstDate = formatDateSpanish(firstDate);
      const formattedLastDate = formatDateSpanish(lastDate);
      const imageUrl = event.imageUrl || "";

      const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #001f60;">Tu evento ha finalizado</h2>
    <p>Gracias por compartir tu evento en nuestra plataforma. Aquí tienes un resumen:</p>

    <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 20px 0;">
      <img src="${imageUrl}" alt="Imagen del evento" style="width: 100%; height: auto; display: block;" />
      <div style="padding: 15px;">
        <h3 style="color: #001f60; margin-top: 0;">${event.title}</h3>

        <p><strong>📅 Fecha de inicio:</strong> ${formattedFirstDate}</p>
        <p><strong>📅 Fecha de fin:</strong> ${formattedLastDate}</p>

        ${
          event.description
            ? `<p style="margin-top: 10px;"><strong>📝 Descripción:</strong><br>${event.description}</p>`
            : ""
        }

        <p><strong>👁️ Vistas:</strong> ${event.views || 0}</p>
        <p><strong>❤️ Likes:</strong> ${event.likesCount || 0}</p>
        <p><strong>📋 Reservas totales:</strong> ${reservationCount}</p>
      </div>
    </div>

    <p style="margin-top: 20px;">Esperamos que haya sido todo un éxito.</p>

    <hr style="margin: 40px 0;">
    <p style="font-size: 14px; color: #777;">
      Si tienes otro evento por publicar o necesitas asistencia, contáctanos en
      <a href="mailto:proyectoterminal5@gmail.com">proyectoterminal5@gmail.com</a>.
    </p>
  </div>
`;

      // Enviar correo
      await sendEmail(creator.email, subject, null, html);

      // Marcamos que ya se envio la notificacion
      await Event.findByIdAndUpdate(event._id, { endedNotificationSent: true });
    }
  }
};
