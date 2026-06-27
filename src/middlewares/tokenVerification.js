import JWT, { decode } from "jsonwebtoken";
import AsyncWrapper from "../helpers/asyncHandler.js";
import User from "../Models/admin/adminUserSchema.js";
import { NotFoundError, UnauthorizedError } from "../helpers/apiError.js";

const tokenVerification = AsyncWrapper(async (req, res, next) => {
  const token =
    req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("No authorization token provided.");
  }

  let decoded;
  try {
    decoded = JWT.verify(token, process.env.JWT_AUTH_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new UnauthorizedError("Authorization token expired.");
    }
    throw new UnauthorizedError("Invalid authorization token.");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new NotFoundError(
      "User not found.",
      "Invalid credentials",
      "USER_NOT_FOUND",
    );
  }

  req.user = user;
  next();
});

export default tokenVerification;
