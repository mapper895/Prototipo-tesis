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
export const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      response_format: "url",
    });

    return response.data[0].url;
  } catch (error) {
    console.log(
      "Error al generar imagen: ",
      error.response?.data || error.message || error
    );
    throw new Error("Error al generar imagen con DALL-E");
  }
};

// Generar texto publicitario con GPT-4
// Pasar la fecha a array de fechas
export const generateCopy = async (event) => {
  const prompt = `Crea un texto promocional para redes sociales sobre el siguiente evento. Sé llamativo, termina con una llamada a la acción. 
    Título: ${event.title}
    Descripción: ${event.description}
    Fecha: ${event.dates?.[0] || "fecha por definir"}
    Categoria: ${event.category}`;

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
