
export const APP_URL = `http://localhost:${process.env.PORT}`;
export const MONGODB_URI = process.env.MONGODB_URI;
export const ACCESS_TOKEN = {
  secret: process.env.JWT_SECRET,
  expiry: process.env.JWT_EXPIRY,
};
export const ENVIRONMENT = process.env.NODE_ENV;

if (!MONGODB_URI) {
  throw new Error("No MONGODB_URI found in .env");
}
if (Object.values(ACCESS_TOKEN).length === 0) {
  throw new Error("No ACCESS_TOKEN_EXPIRY found in .env");
}
