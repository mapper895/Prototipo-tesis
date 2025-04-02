import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-prototipo"];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Desautorizado - No hay token" });
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Desautorizado - token no valido" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Actualizamos la fecha de ultima actividad
    user.lastActive = new Date();
    await user.save();

    req.user = user;

    next();
  } catch (error) {
    console.log("Error en protectRoute middleware: ", error.message);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
