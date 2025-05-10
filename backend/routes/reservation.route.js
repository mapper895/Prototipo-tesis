import express from "express";
import { createReservation } from "../controllers/reservation.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/reserve", protectRoute, createReservation);

export default router;
