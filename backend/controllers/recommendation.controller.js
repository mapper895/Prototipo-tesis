import { runPythonRecommender } from "../services/recommender/runRecommender.js";

export async function runSimilarEvents(req, res) {
  try {
    const output = await runPythonRecommender("similarEvents");
    res.json({ message: "Eventos similares actualizados", output });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
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
    res.status(500).json({
      error: "Error actualizando eventos destacados",
      details: error.message,
    });
  }
}

export async function runUserRecommendationsByPreferences(req, res) {
  const userId = req.user._id;
  try {
    await runPythonRecommender("userRecommendationsByPreferences", userId);
    res
      .status(200)
      .json({ message: "Recomendaciones generadas correctamente" });
  } catch (error) {
    console.log("Error en runUserRecommendationsByPreferences: ", error);
    res.status(500).json({
      message: "Error al generar recomendaciones",
      error: error.message,
    });
  }
}
