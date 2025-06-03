import { Feedback } from "../models/feedback.model.js";
import { User } from "../models/user.model.js";

// Guardar feedback
export async function submitFeedback(req, res) {
  try {
    const { rating } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario ya ha dado feedback
    if (user.feedbackGiven) {
      return res.status(400).json({ message: "Ya has dado feedback." });
    }

    // Crear el nuevo feedback
    const feedback = new Feedback({
      userId,
      rating,
    });
    await feedback.save();

    // Actualizar el campo feedbackGiven del usuario
    user.feedbackGiven = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Feedback guardado exitosamente", feedback });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
}
