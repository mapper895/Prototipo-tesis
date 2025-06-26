import {
  runScraping,
  getExistingEvents,
  compareEvents,
  uploadNewEvents,
  runLocalScraping,
} from "./utils/cronJobs.js";

export const testScrapingProcess = async () => {
  console.log("Iniciando el proceso de scraping y actualización de eventos...");
  try {
    // Ejecutar el script de web scraping
    await runLocalScraping();

    // Obtener los eventos de la plataforma
    const eventosExistentes = await getExistingEvents();

    // Comparar los eventos obtenidos con los ya existentes
    const nuevosEventos = await compareEvents(eventosExistentes);

    // Subir los nuevos eventos a la plataforma
    console.log("Llamando a la funcion uploadEvents");
    await uploadNewEvents(nuevosEventos);

    console.log("Proceso completado.");
  } catch (error) {
    console.log(
      "Error en el proceso de scraping y actualización de eventos:",
      error
    );
  }
};
