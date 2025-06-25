import express from "express";

import authRoutes from "./routes/auth.route.js";
import eventRouter from "./routes/event.route.js";
import mapsRoute from "./routes/maps.route.js";
import dashboardRoute from "./routes/dashboard.routes.js";
import reservationRoute from "./routes/reservation.route.js";
import notificationRoute from "./routes/notification.routes.js";
import recommendationRoute from "./routes/recommendation.routes.js";
import feedbackRoute from "./routes/feedback.routes.js";
import eventPublisher from "./routes/eventPublisher.routes.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import "./utils/cronJobs.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import axios from "axios";
import { testScrapingProcess } from "./testCron.js";

// Obtener el nombre del archivo y la ruta de la carpeta actual
const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

// Configurar express para servir archivos estaticos
// app.use(express.static(path.join(__dirname, "public")))

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/maps", mapsRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/reservation", reservationRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/recommendation", recommendationRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/v1/event-publisher", eventPublisher);

if (ENV_VARS.NODE_ENV === "production") {
  //testScrapingProcess();
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("El servidor esta listo en http://localhost:" + PORT);
  connectDB();
});
