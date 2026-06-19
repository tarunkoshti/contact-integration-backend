import dotenv from 'dotenv';
dotenv.config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TIMEZONE || 'Asia/Kolkata';

export const db = {
  port: process.env.DB_PORT || '',
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
};

export const google = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI
}

export const corsUrl = process.env.CORS_URL;
