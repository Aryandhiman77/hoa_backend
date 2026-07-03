import rateLimit from "express-rate-limit";

import { TooManyRequestsError } from "../../helpers/apiError.js"; // You can create this class similar to BadRequestError

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    // Throw an error to be handled by asyncHandler / centralized error middleware
    next(
      new TooManyRequestsError(
        "Too many attempts. Please try again after 15 minutes.",
      ),
    );
  },
});

export const logoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // less strict for logout
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    next(
      new TooManyRequestsError(
        "Too many logout attempts. Please try again later.",
      ),
    );
  },
});
