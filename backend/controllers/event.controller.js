import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

// Crear un nuevo evento
export async function createEvent(req, res) {
  try {
    const {
      eventId,
      title,
      description,
      category,
      duration,
      location,
      latitude,
      longitude,
      imageUrl,
      target,
      accessibility,
      organizer,
      eventUrl,
      dates,
      schedules,
      costs,
    } = req.body;

    // Convertimos latitud y longitud a numeros
    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude);

    console.log("Latitud: ", lat, "longitud: ", lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Las coordenadas son inválidas" });
    }

    // Si no tenemos las coordenadas las obtenemos con la API de Google Maps
    if (!lat || !lng) {
      console.log(
        "No se proporcionaron coordenadas. Usando la API de Google Maps"
      );

      // Si no se proporciona la ubicacion, retornamos error
      if (!location) {
        return res.status(400).json({ message: "La direccion es obligatoria" });
      }

      // Obtener las coordenadas con la api de Google Maps
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${ENV_VARS.GOOGLE_MAPS_API_KEY}`;

      const response = await axios.get(googleMapsUrl);
      const data = response.data;

      if (!data || data.status !== "OK" || data.results.length === 0) {
        return res.status(400).json({ message: "Dirección no válida" });
      }

      const locationData = data.results[0].geometry.location;

      lat = locationData.lat;
      lng = locationData.lng;

      console.log("Coordenadas obtenidas de la API: ", lat, lng);
    }

    // const getDays = (dateISO) => {
    //   const weekDays = [
    //     "Domingo",
    //     "Lunes",
    //     "Martes",
    //     "Miércoles",
    //     "Jueves",
    //     "Viernes",
    //     "Sábado",
    //   ];
    //   const newDate = new Date(dateISO);
    //   return weekDays[newDate.getUTCDay()];
    // };

    // const weekDay = getDays(date);
    // const days = [weekDay];

    // Verificar si ya existe un evento con el mismo título y fecha
    const existingEvent = await Event.findOne({
      title: title,
      dates: { $size: dates.length, $all: dates },
    });

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: "Ya existe el evento",
      });
    }

    // Verificamos que el organizador existe (si es proporcionado en el JSON)
    let userId = req.user ? req.user._id : null;

    if (!userId) {
      const adminUser = await User.findOne({ username: "admin" });
      if (!adminUser) {
        return res.status(500).json({
          message: "No se encontro un administrador en la base de datos",
        });
      }
      userId = adminUser._id;
    }

    const newEvent = new Event({
      eventId,
      title,
      description,
      category,
      duration,
      location,
      latitude: lat,
      longitude: lng,
      imageUrl,
      target,
      accessibility,
      organizer,
      eventUrl,
      dates,
      schedules,
      costs,
      createdBy: userId,
    });

    const savedEvent = await newEvent.save();

    // Despues de crear el evento, actualizamos el campo "createdEvents" en el usuario
    await User.findByIdAndUpdate(userId, {
      $push: { createdEvents: savedEvent._id }, // Agregamos el Id del evento a createdEvents
    });

    console.log("Evento creado exitosamente: ", savedEvent);

    res.status(201).json({
      success: true,
      event: savedEvent,
    });
  } catch (error) {
    console.log("Error al crear el evento:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear el evento",
    });
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

    // Incrementamos el contador de vistas
    event.views += 1;
    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener el evento" });
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
    const eventId = req.params.id; // EL Id del evento que queremos actualizar
    const updatedEventData = req.body; // Los nuevos datos enviados para actualizar el evento
    const userId = req.user._id; // EL usuario que esta intentando actualizar el evento

    // Buscamos el evento por ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    // Verificamos que el usuario que esta intentando actualizar el evento sea el organizador
    if (event.organizer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "No autorizado a actualizar este evento",
      });
    }

    // Si se proporciona una nueva ubicacion, obtenemos las coordenadas usando la API de Google Maps
    if (updatedEventData.location) {
      const location = updatedEventData.location;

      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${ENV_VARS.GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(googleMapsUrl);
      const locationData = response.data.results[0]; // Tomamos el primer resultado de la API

      if (locationData) {
        updatedEventData.address = locationData.formatted_address; // Guardamos la direccion formateada
        updatedEventData.coordinates = locationData.geometry.location; // Coordenadas (lat, lng)
      }
    }

    // Si el campo "organizer" se proporciona, buscamos el _id del organizador (en vez del username)
    if (updatedEventData.organizer) {
      const organizer = await User.findOne({
        username: updatedEventData.organizer,
      });

      if (organizer) {
        updatedEventData.organizer = organizer._id; // Asignamos el _id del organizador
      } else {
        // Si no encontramos el organizador, asignamos al usuario que está editando el evento
        updatedEventData.organizer = userId;
      }
    }

    // Actualizamos el campo 'updatedAt' con la fecha actual
    updatedEventData.updatedAt = new Date();

    // Actualizamos el evento con los nuevos datos
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updatedEventData,
      { new: true }
    );

    if (!updatedEvent) {
      return res
        .status(400)
        .json({ success: false, message: "No se pudo actualizar el evento" });
    }

    // Respondemos con el evento actualizado
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el evento" });
  }
}

// Eliminar un evento
export async function deleteEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(400)
        .json({ success: false, message: "Evento no encontrado" });
    }

    // Verificamos si el usuario actual es el creador del evento
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No autorizado para eliminar este evento",
      });
    }

    await event.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Evento eliminado existosamente" });
  } catch (error) {
    console.log("Error al eliminar el evento: ", error.message);
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
    const events = await Event.find({ createdBy: req.params.userId });
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
