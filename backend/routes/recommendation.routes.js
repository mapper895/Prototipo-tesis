import express from "express";
import { generateRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/generate", generateRecommendations);

export default router;
