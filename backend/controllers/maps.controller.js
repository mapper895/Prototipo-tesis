import { ENV_VARS } from "../config/envVars.js";

export function getApiKey(req, res) {
  res.json({ apiKey: ENV_VARS.GOOGLE_MAPS_API_KEY });
}
