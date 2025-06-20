import { ENV_VARS } from "../config/envVars.js";
import { Feedback } from "../models/feedback.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/emailService.js";

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

export async function getRating(req, res) {
  try {
    const user = req.user;

    if (user.username !== "admin") {
      return res.status(404).json({ message: "Usuario no valido" });
    }
    const feedbacks = await Feedback.find();

    // Contadores para cada rating (1, 2, 3, 4, 5 estrellas)
    let totalRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumRatings = 0;

    // Recorremos todos los feedbacks para contar y sumar las valoraciones
    feedbacks.forEach((feedback) => {
      totalRatings[feedback.rating]++;
      sumRatings += feedback.rating;
    });

    // Calculamos el porcentaje promedio
    const averageRating = sumRatings / feedbacks.length;

    // Enviamos la respuesta con el puntaje promedio y la distribucion
    res.status(200).json({
      success: true,
      averageRating: averageRating.toFixed(1),
      totalRatings,
      totalFeedbacks: feedbacks.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener rating" });
  }
}

//Enviar comentario por correo
export async function sendComment(req, res) {
  const { comment } = req.body;

  if (!comment) {
    return res
      .status(400)
      .json({ success: false, message: "El comentario es requerido" });
  }

  try {
    await sendEmail(
      ENV_VARS.GMAIL_EMAIL_USER,
      "Nuevo comentario en el sitio",
      null,
      `<p><strong>Comentario: <strong><br>${comment}</p>`
    );

    return res
      .status(200)
      .json({ success: true, message: "Comentario enviado con exito" });
  } catch (error) {
    console.log("Error al ennviar el correo: ".error);
    return res
      .status(500)
      .json({ success: false, message: "Error al enviar el comentario" });
  }
}
