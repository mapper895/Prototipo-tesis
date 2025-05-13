import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para obtener las notificaciones de un usuario
router.get("/", protectRoute, getUserNotifications);
// Ruta para obtener una notificacion como leida
router.put("/read/:id", protectRoute, markNotificationAsRead);

export default router;
