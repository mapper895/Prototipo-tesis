import axios from "axios";
import { OpenAI } from "openai";
import { Event } from "../models/event.model.js";
import { ENV_VARS } from "../config/envVars.js";
import fetch from "node-fetch";

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const openai = new OpenAI({ apiKey: ENV_VARS.OPENAI_API_KEY });

// Obtener evento desde MongoDB por ID
export const getEventById = async (eventId) => {
  return await Event.findById(eventId);
};

// Generar imagen con DALL-E
export const generateImage = async (prompt, fallbackUrl) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      response_format: "url",
    });

    const url = response?.data?.[0]?.url;
    if (!url) throw new Error("Respuesta sin URL");

    return url;
  } catch (error) {
    console.log(
      "Error al generar imagen: ",
      error.response?.data || error.message || error
    );
    // Usar imagen del evento si no se puede generar una nueva
    if (fallbackUrl) {
      console.log("Usando imagen almacenada del evento");
      return fallbackUrl;
    }
    throw new Error("Error al generar imagen con DALL-E");
  }
};

// Generar texto publicitario con GPT-4
// Pasar la fecha a array de fechas
export const generateCopy = async (event) => {
  const prompt = `Redacta un texto atractivo y dinámico para promocionar el siguiente evento en redes sociales. Usa un lenguaje cercano y creativo. Inspírate en la descripción para transmitir la esencia del evento. Termina con una invitación clara a participar e incluye el siguiente enlace como llamada a la acción. No repitas literalmente los campos.

Título del evento: ${event.title}
Descripción: ${event.description}
Fecha: ${event.dates?.[0] || "fecha por definir"}
Categoría: ${event.category}
Ubicación: ${event.location}
Enlace al evento: https://tesis-app-7sij.onrender.com/events/${event._id}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log(
      "Error al generar copy: ",
      error.response?.data || error.message
    );
    throw new Error("Error al generar el texto promocional");
  }
};

// Publicar imagen y caption en una pagina de Facebook
export const postToFacebookPage = async (
  pageId,
  message,
  imageUrl,
  accessToken
) => {
  try {
    if (!pageId || pageId === "0") throw new Error("ID de página inválido");
    if (!accessToken) throw new Error("Access token no proporcionado");

    const url = `https://graph.facebook.com/v18.0/${pageId}/photos`;

    const response = await axios.post(url, null, {
      params: {
        url: imageUrl,
        caption: message,
        access_token: accessToken,
      },
    });

    return response.data;
  } catch (error) {
    console.log(
      "Error al publicar en Facebook: ",
      error.response?.data || error.message
    );
    throw new Error("Error al publicar en Facebook");
  }
};

// Publicar imagen y caption en Instagram
export const postToInstagram = async (
  igAccountId,
  imageUrl,
  caption,
  accessToken
) => {
  try {
    const containerRes = await axios.post(
      `https://graph.facebook.com/v18.0/${igAccountId}/media`,
      {
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }
    );

    const creationId = containerRes.data.id;

    const publishRes = await axios.post(
      `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
      { creation_id: creationId, access_token: accessToken }
    );

    return publishRes.data;
  } catch (error) {
    console.log(
      "Error al publicar en Instagram: ",
      error.response?.data || error.message
    );
    throw new Error("Error al publicar en Instagram");
  }
};
