import { ENV_VARS } from "../config/envVars.js";
import {
  getEventById,
  generateImage,
  generateCopy,
  postToFacebookPage,
  postToInstagram,
} from "../services/publisher.services.js";

export const publishEventController = async (req, res) => {
  const { eventId } = req.params;
  const fbPageId = ENV_VARS.FB_PAGE_ID;
  const igAccountId = ENV_VARS.IG_ACCOUNT_ID;
  const fbAccessToken = ENV_VARS.FB_ACCESS_TOKEN;
  const igAccessToken = ENV_VARS.IG_ACCESS_TOKEN;

  try {
    const event = await getEventById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    const firstDate = event.dates?.[0] || "fecha por definir";
    const imagePrompt = `Evento: ${event.title}. Categoria: ${event.category}. Fecha: ${firstDate}. Lugar: ${event.location}. Crea una imagen llamativa para redes sociales.`;
    const imageUrl = await generateImage(imagePrompt, event.imageUrl);
    const copy = await generateCopy(event);

    // const fbResponse = await postToFacebookPage(
    //   fbPageId,
    //   copy,
    //   imageUrl,
    //   fbAccessToken
    // );
    const igResponse = await postToInstagram(
      igAccountId,
      imageUrl,
      copy,
      igAccessToken
    );

    res.status(200).json({
      success: true,
      message: "Evento publicado correctamente.",
      //facebook: fbResponse,
      instagram: igResponse,
    });
  } catch (error) {
    console.log("Error en publishEventController: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
