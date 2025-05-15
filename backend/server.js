import express from "express";

import authRoutes from "./routes/auth.route.js";
import eventRouter from "./routes/event.route.js";
import mapsRoute from "./routes/maps.route.js";
import dashboardRoute from "./routes/dashboard.routes.js";
import reservationRoute from "./routes/reservation.route.js";
import notificationRoute from "./routes/notification.routes.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import "./utils/cronJobs.js";

const app = express();

const PORT = ENV_VARS.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/maps", mapsRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/reservation", reservationRoute);
app.use("/api/v1/notification", notificationRoute);

app.listen(PORT, () => {
  console.log("El servidor esta listo en http://localhost:" + PORT);
  connectDB();
});
