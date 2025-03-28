import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

// Crear un nuevo evento
export async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      time,
      imageUrl,
      organizer,
    } = req.body;

    let organizerId;

    if (organizer) {
      const existingUser = await User.findOne({ username: organizer });
      if (!existingUser) {
        return res.status(400).json({ message: "El organizador no existe" });
      }
      organizerId = existingUser._id;
    } else {
      const adminUser = await User.findOne({ username: "admin" });
      if (!adminUser) {
        return res.status(500).json({
          message: "No se encontro un administrador en la base de datos",
        });
      }
      organizerId = adminUser._id;
    }

    if (!location) {
      return res.status(400).json({ message: "La direccion es obligatoria" });
    }

    const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${ENV_VARS.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(googleMapsUrl);
    const data = response.data;

    if (!data || data.status !== "OK" || data.results.length === 0) {
      return res.status(400).json({ message: "Dirección no válida" });
    }

    const formattedAddress = data.results[0].formatted_address;
    const { lat, lng } = data.results[0].geometry.location;

    const getDays = (dateISO) => {
      const weekDays = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const newDate = new Date(dateISO);
      return weekDays[newDate.getUTCDay()];
    };

    const weekDay = getDays(date);
    const days = [weekDay];

    // Verificar si ya existe un evento con el mismo título y fecha
    const existingEvent = await Event.findOne({ title, date });

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: "Ya existe el evento",
      });
    }

    const newEvent = new Event({
      title,
      description,
      category,
      location,
      address: formattedAddress,
      date,
      time,
      days,
      imageUrl,
      organizer: organizerId,
      coordinates: { lat, lng },
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      event: {
        savedEvent,
      },
    });
  } catch (error) {
    console.log("Error en event controller", error.message);

    if (error.message === "No results found for the address") {
      return res.status(400).json({
        success: false,
        message: "La direccion no es valida o no se pudo gecodificar",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Error al crear el evento" });
  }
}

// Obtener todos los eventos
export async function getAllEvents(req, res) {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener eventos" });
  }
}

// Obtener un evento por ID
export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(400)
        .json({ success: false, message: "Evento no encontrado" });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Error al obtener el evento" });
  }
}

// Obtener eventos por categoria
export async function getEventsByCategory(req, res) {
  try {
    const { category } = req.params; // Obtener la categoría desde los parámetros de la URL
    const events = await Event.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });

    if (events.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron eventos para la categoría.",
      });
    }

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los eventos por categoría",
    });
  }
}

// Obtener las categorias
export async function getCategories(req, res) {
  try {
    const categories = await Event.distinct("category");
    res.status(200).json({ success: true, categories });
  } catch {
    res.status(500).json("Error al obtener categorias");
  }
}

// Actualizar un evento
export async function updateEvent(req, res) {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Evento no encontrado" });
    }
    res.status(200).json({ success: true, updatedEvent });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error al actualizar el evento" });
  }
}

// Eliminar un evento
export async function deleteEvent(req, res) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Evento no encontrado" });
    }
    res
      .status(200)
      .json({ success: true, message: "Evento eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar el evento" });
  }
}

// Funcion para dar o quitar likes a un evento
export async function toggleLikeEvent(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    // Verificamos si el usuario ya le ha dado like
    const hasLiked = event.likedBy.includes(userId);

    if (hasLiked) {
      event.likedBy = event.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      event.likesCount -= 1;
    } else {
      // Si no ha dado like, agregamos
      event.likedBy.push(userId);
      event.likesCount += 1;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? "Like eliminado" : "Like agregado",
      likesCount: event.likesCount,
      likedBy: event.likedBy,
    });
  } catch (error) {
    console.log("Error en toggleLike controller: ", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error al procesar el like" });
  }
}

// Buscar eventos
export async function searchEvents(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "El término de la busqueda es obligatorio",
      });
    }

    const regex = new RegExp(query, "i"); // Busqueda insensible a mayusculas y minusculas

    const events = await Event.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { address: { $regex: regex } },
      ],
    });

    if (events.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontraron eventos" });
    }

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.log("Error en searchEvents controller:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error al buscar eventos" });
  }
}

//Eventos de un usuario
export async function getUserEvents(req, res) {
  try {
    const events = await Event.find({ organizer: req.params.userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los eventos" });
  }
}

//Eventos a los que un usuario ha dado like
export async function getUserLikedEvents(req, res) {
  try {
    const userId = req.user._id; // EL Id del usuario autenticado

    // Encontramos los eventos donde el usuario esté en el array "likedBy"
    const events = await Event.find({ likedBy: userId });

    if (!events || events.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No le has dado like a ningun evento",
      });
    }

    res.status(200).json(events); // Devolvemos los datos
  } catch (error) {
    console.log("Error al obtener eventos likeados: "), error.message;
    res.status(500).json({
      success: false,
      message: "Error al obtener eventos a los que has likeado",
    });
  }
}
