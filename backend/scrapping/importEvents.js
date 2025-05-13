import axios from "axios";
import fs from "fs";

const API_URL = "http://localhost:5000/api/v1/event/create-event";

fs.readFile("events_12_05_2025.json", "utf8", async (error, data) => {
  if (error) {
    console.log("Error al leer el archivo: ", error);
    return;
  }

  const events = JSON.parse(data);

  const createEvent = async (event) => {
    try {
      const reponse = await axios.post(API_URL, event);
      console.log(`Evento creado: ${event.title}`);
    } catch (error) {
      console.log(
        `Error al crear el evento ${event.title}: `,
        error.response?.data?.message || error.message
      );
    }
  };

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    await createEvent(event);
  }

  console.log("Todos los eventos han sido procesados");
});
