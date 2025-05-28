import express from "express";
import {
  runFeaturedEvents,
  runSimilarEvents,
  runUserRecommendations,
  runUserRecommendationsByPreferences,
} from "../controllers/recommendation.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/similar-events", runSimilarEvents);
router.post("/user-recommendations", runUserRecommendations);
router.get(
  "/user-recommendations-by-preferences",
  protectRoute,
  runUserRecommendationsByPreferences
);
router.post("/featured-events", runFeaturedEvents);

export default router;
