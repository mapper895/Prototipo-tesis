import mongoose from "mongoose";

// Modelo del evento eventSchema{titulo, descripcion, categoria, lugar, direccion, horario (de que dia a que dia), horario (dias), horario (horas), imagen, organizador, frecha_creacion, fecha_actualizacion}
// Hace falta poner eventos_similares, me_gustas
const eventSchema = new mongoose.Schema({
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
    enum: ["Arte", "Talleres", "Deporte", "Concierto", "Cultura"], // Puedes ajustar o expandir las categorías
    required: true,
  },
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  location: {
    // Ciudad o region
    type: String,
    required: true,
    trim: true,
  },
  address: {
    // Direccion especifica
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  days: {
    type: [String],
    required: true,
    enum: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  },
  imageUrl: {
    type: String,
    required: false,
  },
  organizer: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Event = mongoose.model("Event", eventSchema);
