import mongoose from "mongoose";

// Modelo del evento eventSchema{titulo, descripcion, categoria, lugar, direccion, horario (de que dia a que dia), horario (dias), horario (horas), imagen, organizador, frecha_creacion, fecha_actualizacion}
// Hace falta poner eventos_similares, me_gustas
const eventSchema = new mongoose.Schema(
  {
    eventId: {
      // Este es el Id del evento de la carteleraCDMX
      type: Number,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    location: {
      // Direccion en string
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    target: {
      type: String,
    },
    accessibility: {
      type: String,
    },
    organizer: {
      // Este es el organizador del evento
      type: String,
      trim: true,
    },
    eventUrl: {
      type: String,
    },
    dates: {
      type: [String],
      required: true,
    },
    schedules: {
      type: [String],
      required: true,
    },
    costs: [
      {
        type: new mongoose.Schema({
          type: { type: String, required: true },
          price: { type: String, required: true },
        }),
      },
    ],
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
