import express from "express";
import {
  exportDashboardToCSV,
  exportDashboardToPDF,
  getUserDashboardStats,
} from "../controllers/dashboard.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para obtener las estadísticas del dashboard
router.get("/stats", protectRoute, getUserDashboardStats);
// Ruta para exportar el reporte en CSV
router.get("/export/csv", protectRoute, exportDashboardToCSV);
// Ruta para exportar el reporte en PDF
router.get("/export/pdf", protectRoute, exportDashboardToPDF);

export default router;
