import express from "express";
import {
  runFeaturedEvents,
  runSimilarEvents,
  runUserRecommendations,
} from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/similar-events", runSimilarEvents);
router.post("/user-recommendations", runUserRecommendations);
router.post("/featured-events", runFeaturedEvents);

export default router;
