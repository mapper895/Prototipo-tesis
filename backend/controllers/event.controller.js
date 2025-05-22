import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";
import moment from "moment";
import { sendEventNotificationEmail } from "../utils/notificationService.js";

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

    // if (isNaN(lat) || isNaN(lng)) {
    //   return res.status(400).json({ message: "Las coordenadas son inválidas" });
    // }

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

    const userEmail = req.user.email;
    await sendEventNotificationEmail(userEmail, savedEvent, "creado");

    // Despues de crear el evento, actualizamos el campo "createdEvents" en el usuario
    await User.findByIdAndUpdate(userId, {
      $push: { createdEvents: savedEvent._id }, // Agregamos el Id del evento a createdEvents
    });

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
    const events = await Event.find().sort({ createdAt: -1 }).exec();

    // Filtrar los eventos que tienen fechas futuras
    const today = moment(); // Fecha actual
    const upcomingEvents = events.filter((event) =>
      event.dates.some((dateStr) => {
        const date = moment(dateStr, "DD/MM/YYYY");
        return date.isSameOrAfter(today, "day");
      })
    );

    if (upcomingEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron eventos",
        events: [],
      });
    }

    res.status(200).json({ success: true, events: upcomingEvents });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener eventos" });
  }
}

// Obtener los 10 eventos mas populares
export async function getPopularEvents(req, res) {
  try {
    const today = moment();

    // Trae eventos ordenados por popularidad descendente (likesCount)
    const events = await Event.find().sort({ likesCount: -1 }).lean();

    // Filtra solo eventos con al menos una fecha futura
    const futureEvents = events.filter((event) =>
      event.dates.some((dateStr) => {
        const date = moment(dateStr, "DD/MM/YYYY");
        return date.isSameOrAfter(today, "day");
      })
    );

    if (futureEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron eventos futuros",
        events: [],
      });
    }

    // Si hay menos de 10 eventos futuros, llena con más eventos populares (ignorando fecha)
    // Para asegurar 10, pero preferimos solo futuros si hay suficientes
    let resultEvents = futureEvents.slice(0, 10);

    if (resultEvents.length < 10) {
      // Obtener eventos adicionales que no estén ya en resultEvents
      const idsInResult = new Set(resultEvents.map((e) => e._id.toString()));

      const additionalEvents = events.filter(
        (e) => !idsInResult.has(e._id.toString())
      );

      // Añadir hasta completar 10
      const needed = 10 - resultEvents.length;
      resultEvents = resultEvents.concat(additionalEvents.slice(0, needed));
    }

    return res.status(200).json(resultEvents);
  } catch (error) {
    console.error("Error al obtener eventos populares:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener eventos populares" });
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
    })
      .sort({ createdAt: -1 })
      .exec();

    // Filtrar los eventos que tienen fechas futuras
    const today = moment(); // Fecha actual
    const filteredEvents = events.filter((event) =>
      event.dates.some((dateStr) => {
        const date = moment(dateStr, "DD/MM/YYYY");
        return date.isSameOrAfter(today, "day");
      })
    );

    if (filteredEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron eventos",
        events: [],
      });
    }

    res.status(200).json({ success: true, events: filteredEvents });
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
    const today = new Date();

    const events = await Event.find();

    // Filtramos los eventos que tienen al menos una fecha futura
    const eventsWithFutureDates = events.filter((event) => {
      return event.dates.some((date) => new Date(date) > today);
    });

    // Extraemos las categorías de los eventos futuros
    const categories = eventsWithFutureDates
      .map((event) => event.category) // Extraemos las categorías
      .filter((category, index, self) => self.indexOf(category) === index); // Filtramos duplicados

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
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "No autorizado a actualizar este evento",
      });
    }

    let { latitude, longitude, location } = updatedEventData;
    // Si se proporciona una nueva ubicacion, obtenemos las coordenadas usando la API de Google Maps
    if (location) {
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${ENV_VARS.GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(googleMapsUrl);

      const data = response.data;

      if (!data || data.status !== "OK" || data.results.length === 0) {
        return res.status(400).json({ message: "Dirección no válida" });
      }

      const locationData = data.results[0].geometry.location;
      latitude = locationData.lat;
      longitude = locationData.lng;
    }

    // Si la categoría es diferente o si hay otros cambios en la información, los asignamos
    if (updatedEventData.category) {
      event.category = updatedEventData.category;
    }
    if (updatedEventData.title) {
      event.title = updatedEventData.title;
    }
    if (updatedEventData.description) {
      event.description = updatedEventData.description;
    }
    if (updatedEventData.imageUrl) {
      event.imageUrl = updatedEventData.imageUrl;
    }

    // Actualizamos la dirección y las coordenadas
    if (latitude && longitude) {
      event.latitude = latitude;
      event.longitude = longitude;
    }
    if (updatedEventData.location) {
      event.location = updatedEventData.location;
    }

    // Actualizar otros campos según lo que venga en los datos
    if (updatedEventData.target) {
      event.target = updatedEventData.target;
    }
    if (updatedEventData.accessibility) {
      event.accessibility = updatedEventData.accessibility;
    }
    if (updatedEventData.eventUrl) {
      event.eventUrl = updatedEventData.eventUrl;
    }
    if (updatedEventData.dates) {
      event.dates = updatedEventData.dates;
    }
    if (updatedEventData.schedules) {
      event.schedules = updatedEventData.schedules;
    }
    if (updatedEventData.costs) {
      event.costs = updatedEventData.costs;
    }

    // Actualizar la fecha de la última modificación
    event.updatedAt = new Date();

    // Guardar el evento actualizado
    const updatedEvent = await event.save();

    if (!updatedEvent) {
      return res
        .status(400)
        .json({ success: false, message: "No se pudo actualizar el evento" });
    }

    const userEmail = req.user.email;
    await sendEventNotificationEmail(userEmail, updatedEvent, "actualizado");

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

    // Filtrar los eventos que tienen fechas futuras
    const today = moment(); // Fecha actual
    const futureEvents = events.filter((event) =>
      event.dates.some((dateStr) => {
        const date = moment(dateStr, "DD/MM/YYYY");
        return date.isSameOrAfter(today, "day");
      })
    );

    // Guardar termino de busquda en el historial del usuario, si esta logueado
    if (req.user && req.user._id) {
      // Busca al usuario y actualiza el array
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { searchHistory: query } },
        { new: true, useFindAndModify: false }
      );
    }

    if (futureEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron eventos",
        events: [],
      });
    }

    res.status(200).json({ success: true, events: futureEvents });
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
    const userId = req.user._id;

    const user = await User.findById(userId).populate("createdEvents").exec();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    let userEvents = user.createdEvents;

    if (userEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se han encontrado eventos creados por el usuario",
      });
    }

    // Ordenamos los eventos por la fecha
    userEvents = userEvents.sort((a, b) => {
      // Aseguramos que las fechas estén definidas y las comparamos
      return new Date(b.createdAt) - new Date(a.createdAt); // Más nuevo a más viejo
    });

    return res.status(200).json({ success: true, events: userEvents });
  } catch (error) {
    console.error(
      "Error al obtener los eventos creados por el usuario:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error al obtener los eventos creados por el usuario",
    });
  }
}

//Eventos a los que un usuario ha dado like
export async function getUserLikedEvents(req, res) {
  try {
    const userId = req.user._id; // EL Id del usuario autenticado

    // Encontramos los eventos donde el usuario esté en el array "likedBy"
    const events = await Event.find({ likedBy: userId })
      .sort({ createdAt: -1 })
      .exec();

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

// Eventos similares de un evento
export async function getSimilarEvents(req, res) {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate({
      path: "similarEvents",
      select: "title description imageUrl",
    });

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    const similarEvents = event.similarEvents || [];

    res.json({ similarEvents });
  } catch (error) {
    console.log("Error obteniendo eventos similares", error);
    res.status(500).json({ error: "Error del servidor" });
  }
}

// Recomendaciones de un usuario
export async function getUserRecommendations(req, res) {
  try {
    const user = req.user;

    const recommendedIds = user.recomendation || [];

    const recommendedEvents = await Event.find({
      _id: { $in: recommendedIds },
    });

    res.status(200).json({ success: true, recommendations: recommendedEvents });
  } catch (error) {
    console.log("Error al obtener las recomendaciones del usuario:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "error al obtener las recomendaciones",
      });
  }
}
