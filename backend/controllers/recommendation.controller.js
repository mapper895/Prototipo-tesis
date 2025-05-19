import { runRecommenderScript } from "../services/recommender/caller.js";

export async function generateRecommendations(req, res) {
  try {
    const output = await runRecommenderScript();
    res.json({ message: "Recomendaciones generadas", output });
  } catch (err) {
    res.status(500).json({ error: "Error al generar recomendaciones" });
  }
}
