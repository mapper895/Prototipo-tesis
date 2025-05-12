import express from "express";
import {
  createReservation,
  getUserReservations,
} from "../controllers/reservation.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/reserve", protectRoute, createReservation);
router.get("/user-reservations", protectRoute, getUserReservations);

export default router;
