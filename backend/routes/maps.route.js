import express from "express";
import { getApiKey, getMapId } from "../controllers/maps.controller.js";

const router = express.Router();

router.get("/api-key", getApiKey);
router.get("/map-id", getMapId);

export default router;
