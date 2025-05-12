import express from "express";
import {
  createReservation,
  getUserReservations,
  deleteReservation,
} from "../controllers/reservation.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/reserve", protectRoute, createReservation);
router.get("/user-reservations", protectRoute, getUserReservations);
router.delete("/:id", protectRoute, deleteReservation);

export default router;
