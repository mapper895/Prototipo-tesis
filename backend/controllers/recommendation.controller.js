import { runPythonRecommender } from "../services/recommender/runRecommender.js";

export async function runSimilarEvents(req, res) {
  try {
    const output = await runPythonRecommender("similarEvents");
    res.json({ message: "Eventos similares actualizados", output });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error actualizando eventos similares",
        details: error.message,
      });
  }
}

export async function runUserRecommendations(req, res) {
  try {
    const output = await runPythonRecommender("userRecommendations");
    res.json({ message: "Recomendaciones de usuario actualizadas", output });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error actualizando recomendaciones de usuario",
        details: error.message,
      });
  }
}

export async function runFeaturedEvents(req, res) {
  try {
    const output = await runPythonRecommender("featuredEvents");
    res.json({ message: "Eventos destacados actualizados", output });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error actualizando eventos destacados",
        details: error.message,
      });
  }
}
