import jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../configs/index.js";

const JWT_SECRET = ACCESS_TOKEN.secret;
const JWT_EXPIRY = ACCESS_TOKEN.expiry;

export const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};
