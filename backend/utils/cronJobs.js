import cron from "node-cron";
import { User } from "../models/user.model.js";
import {
  sendWeeklyEvents,
  getWeeklyFeaturedEvents,
  notifyReservationsForTomorrow,
  notifyEventEnded,
} from "./notificationService.js";
import { runPythonRecommender } from "../services/recommender/runRecommender.js";
import axios from "axios";
import { exec } from "child_process";
import fs from "fs";
import { getMostPopularFutureEvent } from "./eventUtils.js";
import { publishEventController } from "../controllers/eventPublisher.controller.js";

// Función para ejecutar todas las tareas de recomendación
async function runAllRecommenders() {
  try {
    console.log("Iniciando tareas de recomendación programadas...");

    await runPythonRecommender("similarEvents");
    console.log("Eventos similares actualizados.");

    await runPythonRecommender("userRecommendations");
    console.log("Recomendaciones de usuario actualizadas.");

    await runPythonRecommender("featuredEvents");
    console.log("Eventos destacados actualizados.");

    console.log("Todas las tareas de recomendación finalizadas.");
  } catch (error) {
    console.error("Error en tareas programadas de recomendación:", error);
  }
}

// Función para ejecutar el script de web scraping(server)
export const runScraping = () => {
  return new Promise((resolve, reject) => {
    exec("python backend/python/web_scrapping.py", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el scraping: ${stderr}`);
        reject(error);
      } else {
        console.log(`Scraping completado: ${stdout}`);
        resolve();
      }
    });
  });
};

// Función para ejecutar el script de web scraping(local)
export const runLocalScraping = () => {
  return new Promise((resolve, reject) => {
    exec(
      "python backend/python/local_web_scraping.py",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el scraping: ${stderr}`);
          reject(error);
        } else {
          console.log(`Scraping completado: ${stdout}`);
          resolve();
        }
      }
    );
  });
};

// Función para obtener los eventos existentes desde la plataforma
export const getExistingEvents = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/event/all-events"
    );

    const events = response.data; // Accedemos directamente a la respuesta JSON
    return events;
  } catch (error) {
    console.error("Error al obtener los eventos existentes: ", error);
    return [];
  }
};

// Función para comparar los eventos obtenidos con los ya existentes
export const compareEvents = (eventosExistentes) => {
  return new Promise((resolve, reject) => {
    // Obtener la fecha actual y generar el nombre del archivo dinámicamente
    const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const fileName = `web_scraping_${today}.json`; // Ruta al archivo generado

    fs.readFile(fileName, "utf8", (error, data) => {
      if (error) {
        console.log("Error al leer el archivo de eventos nuevos: ", error);
        reject(error);
      }

      const eventosNuevos = JSON.parse(data);

      const eventosAgregados = eventosNuevos.filter((eventoNuevo) => {
        return !eventosExistentes.some(
          (eventoExistente) => eventoExistente.eventId === eventoNuevo.eventId
        );
      });

      resolve(eventosAgregados);
    });
  });
};

// Función para subir los nuevos eventos a la plataforma
export const uploadNewEvents = async (nuevosEventos) => {
  const API_URL = "http://localhost:5000/api/v1/event/automatic-create-event";

  for (let event of nuevosEventos) {
    console.log(`Subiendo el evento: ${event.title}`);
    try {
      const response = await axios.post(API_URL, event);
      console.log(`Evento creado: ${event.title}`);
    } catch (error) {
      console.log(
        `Error al crear el evento ${event.title}: `,
        error.response?.data?.message || error.message
      );
    }
  }
};

// Funcion para reutilizar el controlador que espera (req,res)
const fakeReqRes = () => {
  const req = { params: {} };
  const res = {
    status: (code) => ({
      json: (data) => {
        console.log(`Status: ${code}`, data);
      },
    }),
  };
  return { req, res };
};

// Envia los eventos destacados de la semana
cron.schedule(
  "0 8 * * 4",
  async () => {
    // Cada jueves a las 8am
    try {
      const events = await getWeeklyFeaturedEvents();

      if (events.length === 0) {
        console.log("No hay eventos destacados esta semana.");
        return;
      }

      const users = await User.find();

      for (const user of users) {
        await sendWeeklyEvents(user.email, events);
      }

      console.log("Correos semanales enviados correctamente");
    } catch (error) {
      console.log("Error en cron job de eventos destacados: ", error);
    }
  },
  { timezone: "America/Mexico_City" }
);

//Envio de correos para los organizadores recordando que su evento se acerca
//Ejecutar todos los días a las 8am
cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      const tomorrow = moment().add(1, "day").format("DD/MM/YYYY");

      // Buscar eventos que inicien mañana
      const events = await Event.find({ reminderSent: { $ne: true } })
        .populate("createdBy")
        .lean();

      for (const event of events) {
        if (!event.dates || event.dates.length === 0) continue;

        const firstDate = event.dates[0];
        if (firstDate !== tomorrow) continue;

        const creator = event.createdBy;

        // Evitar si no hay creador o si es admin
        if (!creator || creator.username === "admin") continue;

        // Enviar recordatorio al creador
        await sendEventReminder(creator.email, event, creator.username);
        console.log(
          `Recordatorio enviado a ${creator.email} para el evento "${event.title}"`
        );
      }
    } catch (error) {
      console.error(
        "Error al enviar recordatorios de eventos próximos:",
        error
      );
    }
  },
  { timezone: "America/Mexico_City" }
);

// Obtiene y envia notificaciones sobre las reservas de los eventos que son el dia de mañana
cron.schedule(
  "0 8 * * *",
  async () => {
    //Diaramente a las 8AM
    console.log("Ejecutando cron para notificar reservas de eventos de mañana");
    try {
      await notifyReservationsForTomorrow();
      console.log("Notificaciones y correos enviados correctamente");
    } catch (error) {
      console.log("Error enviando notificaciones");
    }
  },
  { timezone: "America/Mexico_City" }
);

// Envia correos notificando eventos terminados
cron.schedule(
  "0 9 * * *",
  async () => {
    console.log("Ejecutando cron para notificar eventos terminados");
    try {
      await notifyEventEnded();
      console.log("Correos de eventos terminados enviados");
    } catch (error) {
      console.log("Error notificando eventos terminados");
    }
  },
  { timezone: "America/Mexico_City" }
);

// Programar la tarea: cada 3 días a las 8:00 AM
// Cron syntax: '0 8 */3 * *' = minuto 0, hora 8, cada 3 días, cualquier mes, cualquier día de la semana
cron.schedule(
  "0 3 * * *",
  () => {
    runAllRecommenders();
    console.log("Cron job ejecutado: actualización de recomendaciones.");
  },
  { timezone: "America/Mexico_City" }
);

// Automatizacion de la publicacion de eventos en redes sociales(publicidad)
cron.schedule(
  "0 19 * * 1",
  async () => {
    console.log("Ejecutando cron job para publicar el evento mas popular...");

    try {
      const popularEvent = await getMostPopularFutureEvent();

      if (!popularEvent) {
        console.log("No hay eventos populares futuros para publicar");
        return;
      }

      const { req, res } = fakeReqRes();
      req.params.eventId = popularEvent._id.toString();

      await publishEventController(req, res);
    } catch (error) {
      console.log("Error en el cron job: ", error.message);
    }
  },
  { timezone: "America/Mexico_City" }
);

//Automatizacion del web scraping
// Se ejecuta una vez a la semana (lunes a las 2:00 AM)
// cron.schedule(
//   "0 21 * * 2",
//   async () => {
//     console.log(
//       "Iniciando el proceso semanal de scraping y actualización de eventos..."
//     );
//     try {
//       // Ejecuta el script de web scraping
//       await runScraping();

//       // Una vez que el scraping haya terminado, obtiene los eventos de la plataforma
//       const eventosExistentes = await getExistingEvents();

//       // Compara los eventos obtenidos con los ya existentes en la base de datos
//       const nuevosEventos = await compareEvents(eventosExistentes);

//       // Subir los nuevos eventos a la plataforma
//       await uploadNewEvents(nuevosEventos);

//       console.log("Proceso completado.");
//     } catch (error) {
//       console.log("Error en el proceso del cron job", error);
//     }
//   },
//   { timezone: "America/Mexico_City" }
// );
