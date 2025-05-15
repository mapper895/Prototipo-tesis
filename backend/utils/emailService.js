import nodemailer from "nodemailer";
import { ENV_VARS } from "../config/envVars.js";

// Configuración del transportador (usando el servicio de Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV_VARS.GMAIL_EMAIL_USER, // Correo electrónico
    pass: ENV_VARS.GMAIL_EMAIL_PASS, // Usa la contraseña de la app
  },
});

// Función generica para enviar correos electrónicos
export const sendEmail = async (to, subject, text = null, html = null) => {
  const mailOptions = {
    from: ENV_VARS.GMAIL_EMAIL_USER, // El correo desde el cual se envía el mensaje
    to, // Destinatario
    subject, // Asunto del correo
    text, // Contenido del correo
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: ", info.response);
    return info;
  } catch (error) {
    console.log("Error al enviar el correo: ", error);
    throw error;
  }
};
