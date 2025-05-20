import { runPythonRecommender } from "../services/recommender/runRecommender.js";

export async function triggerRecommender(req, res) {
  try {
    const result = await runPythonRecommender();
    res.json({ message: "Recomendaciones generadas", datail: result });
  } catch (error) {
    res.status(500).json({ error: "Error al generar recomendaciones" });
  }
}
