import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";

export const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};
