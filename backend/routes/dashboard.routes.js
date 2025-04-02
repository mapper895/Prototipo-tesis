import express from "express";
import {
  exportDashboardToCSV,
  exportDashboardToPDF,
  getUserDashboardStats,
} from "../controllers/dashboard.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para obtener las estadísticas del dashboard
router.get("/:userId", protectRoute, getUserDashboardStats);
// Ruta para exportar el reporte en CSV
router.get("/:userId/export/csv", protectRoute, exportDashboardToCSV);
// Ruta para exportar el reporte en PDF
router.get("/:userId/export/pdf", protectRoute, exportDashboardToPDF);

export default router;
