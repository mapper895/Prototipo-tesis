import express from "express";
import { getApiKey } from "../controllers/maps.controller.js";

const router = express.Router();

router.get("/api-key", getApiKey);

export default router;
