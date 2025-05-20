import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runPythonRecommender() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../../python/recommender.py");
    exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error ejecutando Python:", error);
        return reject(error);
      }
      console.log("Output Python:", stdout);
      resolve(stdout);
    });
  });
}
