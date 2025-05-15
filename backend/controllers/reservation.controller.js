import Reservation from "../models/reservation.model.js";
import { Event } from "../models/event.model.js";
import { sendReservationConfirmationEmail } from "../utils/notificationService.js";

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

    // Enviar correo de confirmación
    await sendReservationConfirmationEmail(req.user.email, reservation, event);

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

export const getUserReservations = async (req, res) => {
  try {
    // Obtenemos al usuario autenticado
    const userId = req.user._id;

    // Obtenemos las reservas del usuario
    const reservations = await Reservation.find({ userId }).populate("eventId");

    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tienes reservas" });
    }

    // Devolvemos las reservas encontradas
    return res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.log("Error al obtener las reservas del usuario");
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener las reservas" });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservacion no encontrada" });
    }

    // Veridicamos que el usuario que hace la solicitus es el mismo que hizo la reserva
    if (reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta reservación",
      });
    }

    // Eliminamos la reservacion
    await Reservation.findByIdAndDelete(reservationId);

    res
      .status(200)
      .json({ success: true, message: "Reservación eliminada con éxito" });
  } catch (error) {
    console.log("Error al eliminar la reservación", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la reservación" });
  }
};
