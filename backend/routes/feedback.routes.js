import express from "express";
import { submitFeedback } from "../controllers/feedback.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Ruta para guardar el feedback
router.post("/submit", protectRoute, submitFeedback);

export default router;
