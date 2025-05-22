import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  runNotifyEventEndedManually,
  runNotifyReservationsManually,
  sendWeeklyEventSummary,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para obtener las notificaciones de un usuario
router.get("/", protectRoute, getUserNotifications);
// Ruta para obtener una notificacion como leida
router.put("/read/:id", protectRoute, markNotificationAsRead);
// Ruta para enviar resumen semanal manualmente
router.post("/weekly-events/send", sendWeeklyEventSummary);
// Ruta para disparar notificaciones manualmente
router.post("/notifications/run", runNotifyReservationsManually);
// Ruta para disparar manualmente la notificacion de eventos terminados
router.post("/notifications/run-ended", runNotifyEventEndedManually);

export default router;
