import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getCategories,
  getEventById,
  getEventsByCategory,
  updateEvent,
  toggleLikeEvent,
  searchEvents,
  getUserEvents,
  getUserLikedEvents,
  getPopularEvents,
} from "../controllers/event.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Rutas para los eventos
router.post("/create-event", protectRoute, createEvent);
router.get("/events", getAllEvents);
router.get("/popular-events", getPopularEvents);
router.get("/events/:id", getEventById);
router.get("/events/category/:category", getEventsByCategory);
router.get("/categories", getCategories);
router.put("/events/:id", protectRoute, updateEvent);
router.delete("/events/:id", protectRoute, deleteEvent);
router.put("/events/:eventId/like", protectRoute, toggleLikeEvent);
router.get("/search", searchEvents);
router.get("/user-events", protectRoute, getUserEvents);
router.get("/liked-events", protectRoute, getUserLikedEvents);

export default router;
