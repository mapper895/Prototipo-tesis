import express from "express";
import {
  exportAllEvents,
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
// Ruta para descargar el JSON de todos los eventos
router.get("/export/all-events", protectRoute, exportAllEvents);

export default router;
