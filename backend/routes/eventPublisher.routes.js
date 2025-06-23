import express from "express";
import { publishEventController } from "../controllers/eventPublisher.controller.js";

const router = express.Router();

router.post("/publish-event/:eventId", publishEventController);

export default router;
