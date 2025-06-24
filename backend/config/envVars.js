import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_MAP_ID: process.env.GOOGLE_MAPS_MAP_ID,
  GMAIL_EMAIL_USER: process.env.GMAIL_EMAIL_USER,
  GMAIL_EMAIL_PASS: process.env.GMAIL_EMAIL_PASS,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,
  IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
  FB_PAGE_ID: process.env.FB_PAGE_ID,
  IG_ACCOUNT_ID: process.env.IG_ACCOUNT_ID,
};
