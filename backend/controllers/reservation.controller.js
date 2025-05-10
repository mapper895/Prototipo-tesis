import Reservation from "../models/reservation.model.js";
import { Event } from "../models/event.model.js";

export const createReservation = async (req, res) => {
  try {
    const { eventId, eventDate, eventSchedule } = req.body; // Fecha y hora seleccionados
    const userId = req.user._id;

    // Validamos que el evento exista
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    // Verificar si la fecha seleccionada es válida
    // Convertir las fechas de event.dates a formato 'DD/MM/YYYY' para compararlas con la fecha seleccionada
    const isDateValid = event.dates.includes(eventDate); // Comparar las fechas en formato 'DD/MM/YYYY'

    if (!isDateValid) {
      return res.status(400).json({
        success: false,
        message: "La fecha seleccionada no es válida",
      });
    }

    // Verificar si la fecha seleccionada es pasada
    const selectedDateObj = new Date(eventDate.split("/").reverse().join("/"));
    const today = new Date();
    if (selectedDateObj < today) {
      return res.status(400).json({
        success: false,
        message: "La fecha seleccionada ya ha pasado",
      });
    }

    // Validamos que el horarios seleccionado este en el array de horarios disponibles
    const isScheduleValid = event.schedules.includes(eventSchedule);

    if (!isScheduleValid) {
      return res.status(400).json({
        success: false,
        message: "El horario seleccionado no es válido",
      });
    }

    // Verificamos si el usuario tiene ya una reserva para ese evento
    const existingReservation = await Reservation.findOne({
      userId,
      eventId,
      eventDate,
      eventSchedule,
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "Ya tienes una reserva para este evento",
      });
    }

    // Crear la nueva reserva
    const reservation = new Reservation({
      userId,
      eventId,
      eventDate,
      eventSchedule,
      createdAt: new Date(),
    });

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reserva realizada con éxito",
      reservation,
    });
  } catch (error) {
    console.log("Error al realizar la reserva", error);
    res
      .status(500)
      .json({ success: false, message: "Error al realizar la reserva" });
  }
};
