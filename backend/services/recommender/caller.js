import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runRecommenderScript() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../../python/recommender.py");
    exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(stderr);
      }
      resolve(stdout);
    });
  });
}
