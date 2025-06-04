import express from "express";
import {
  getRating,
  submitFeedback,
} from "../controllers/feedback.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para guardar el feedback
router.post("/submit", protectRoute, submitFeedback);
// Ruta para obtener rating
router.get("/rating", protectRoute, getRating);

export default router;
