import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt-prototipo", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 dias en milisegundos
    httpOnly: true, // Previene ataques XSS (cross-site scripting), evita que sea accesible mediante JavaScript
    sameSite: "strict", // Ataques CSRF (Cross-Site Request Forgery), ataques de falsificación de solicitudes entre sitios.
    secure: ENV_VARS.NODE_ENV !== "development",
  });

  return token;
};
