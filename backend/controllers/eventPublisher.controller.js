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
  const accessToken = ENV_VARS.META_ACCESS_TOKEN;

  try {
    const event = await getEventById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento no encontrado" });
    }

    const firstDate = event.dates?.[0] || "fecha por definir";
    const imagePrompt = `Evento: ${event.title}. Categoria: ${event.category}. Fecha: ${firstDate}. Lugar: ${event.location}. Crea una imagen llamativa para redes sociales.`;
    //const imageUrl = await generateImage(imagePrompt);
    const imageUrl =
      "https://cartelera.cdmx.gob.mx/wp-content/uploads/ae_usercontent/usercontent/683601fd2ff19-IMG-20250526-WA0013.jpg";
    //const copy = await generateCopy(event);
    const copy = `🎨 ¡Haz arte con las palabras de Rosario Castellanos! 🖌️

En el marco de la exposición Un cielo sin fronteras. Rosario Castellanos: archivo inédito, el Colegio de San Ildefonso te invita a intervenir tu propia serigrafía 🎨✨. Usa brochas, esponjas, espátulas y rodillos para dar vida al pensamiento de una de las escritoras más importantes de México.

🖋️ Combina pintura con letras, palabras y conceptos inspirados en su legado, y concluye con una impresión en serigrafía de una foto de Rosario Castellanos. ¡Una experiencia artística única y profunda!

📅 Domingos 15 y 29 de junio
🕦 11:30 a 13:30 h
🎟️ Costo: $60.00 MXN
📍 Cupo limitado | ¡Reserva tu lugar!
📞 5536020028
📧 acsiedu@gmail.com

👉 ¡No te lo pierdas! Vive el arte, crea memoria.`;

    const fbResponse = await postToFacebookPage(
      fbPageId,
      copy,
      imageUrl,
      accessToken
    );
    const igResponse = await postToInstagram(
      igAccountId,
      imageUrl,
      copy,
      accessToken
    );

    res.status(200).json({
      success: true,
      message: "Evento publicado correctamente.",
      facebook: fbResponse,
      instagram: igResponse,
    });
  } catch (error) {
    console.log("Error en publishEventController: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
