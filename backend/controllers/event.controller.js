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
    // Función para convertir fechas "dd/mm/yyyy" a objetos Date
    const convertToDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
    };

    // Obtener la fecha actual
    const today = new Date();

    // Filtrar los eventos que tienen al menos una fecha futura
    const upcomingEvents = events.filter((event) => {
      return event.dates.some((date) => convertToDate(date) > today);
    });

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
    const events = await Event.find().sort({
      likesCount: -1,
    });

    const today = new Date();

    const futureEvents = events.filter((event) =>
      event.dates.some((date) => new Date(date) >= today)
    );

    // Si hay menos de 10 eventos con fechas futuras, completar con más eventos populares con fechas futuras
    const requiredEvents = 10; // Queremos exactamente 10 eventos
    const remainingNeeded = requiredEvents - futureEvents.length;

    // Si no hay suficientes eventos futuros, obtener más eventos populares que también tengan fechas futuras
    if (remainingNeeded > 0) {
      const additionalEvents = events
        .filter((event) => new Date(event.dates[0]) >= today) // Solo eventos con fechas futuras
        .slice(0, remainingNeeded); // Limitar la cantidad de eventos adicionales

      // Combinar los eventos futuros con los eventos adicionales
      futureEvents.push(...additionalEvents);
    }

    if (futureEvents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay eventos populares futuros",
      });
    }

    return res.status(200).json(futureEvents.slice(0, requiredEvents));
  } catch (error) {
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

    const today = new Date();

    const events = await Event.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });

    // Filtrar eventos en el servidor después de obtenerlos, solo aquellos con fechas futuras
    const filteredEvents = events.filter((event) => {
      // Convertir las fechas de string a Date y verificar si alguna es mayor o igual a today
      return event.dates.some((date) => new Date(date) >= today);
    });

    if (filteredEvents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron eventos para la categoría.",
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
    const today = new Date(); // Fecha actual
    const futureEvents = events.filter((event) =>
      event.dates.some((date) => new Date(date) > today)
    );

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

    const user = await User.findById(userId).populate("createdEvents");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const userEvents = user.createdEvents;

    if (userEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se han encontrado eventos creados por el usuario",
      });
    }

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
