import express from "express";
import { triggerRecommender } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/run", triggerRecommender);

export default router;
