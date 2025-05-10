import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo del usuario
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Referencia al modelo del evento
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  eventSchedule: {
    type: String,
    required: true,
  },
  reservedAt: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
