import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ejecuta un script Python específico según la tarea indicada.
 * @param {string} task - Nombre de la tarea: "similarEvents", "userRecommendations", "featuredEvents"
 * @param {string} userId - Id del usuario para generar las recomendaciones especificas
 */
export function runPythonRecommender(task, userId) {
  return new Promise((resolve, reject) => {
    // Mapear tarea a archivo Python o argumento para el script principal
    const scriptMap = {
      similarEvents: "similar_events.py",
      userRecommendations: "user_recommendations.py",
      userRecommendationsByPreferences:
        "user_recommendations_by_preferences.py",
      featuredEvents: "featured_events.py",
    };

    const scriptFile = scriptMap[task];
    if (!scriptFile) {
      return reject(new Error(`Tarea no válida: ${task}`));
    }

    const scriptPath = path.join(__dirname, "../../python", scriptFile);
    console.log(`Ruta del script de python: ${scriptPath}`);

    exec(`python "${scriptPath}" ${userId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando Python (${task}):`, error);
        return reject(error);
      }
      if (stderr) {
        console.warn(`Warning Python (${task}):`, stderr);
      }
      console.log(`Output Python (${task}):`, stdout);
      resolve(stdout);
    });
  });
}
