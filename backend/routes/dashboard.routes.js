import express from "express";
import { getUserDashboardStats } from "../controllers/dashboard.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para obtener las estadísticas del dashboard
router.get("/:userId", protectRoute, getUserDashboardStats);

export default router;
