import Notification from "../models/notification.model.js";

// Obtener notificaciones de un usuario
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 }); // Ordenar por la fecha más reciente
    //.populate("eventId"); // Obtener los detalles del evento asociado

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener las notificaciones" });
  }
};

// Marcar una notificación como leída
export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }

    notification.read = true; // Marcamos como leída
    await notification.save();

    res
      .status(200)
      .json({ success: true, message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    res.status(500).json({
      success: false,
      message: "Error al marcar la notificación como leída",
    });
  }
};
