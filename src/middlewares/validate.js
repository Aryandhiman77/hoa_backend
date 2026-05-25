import { ApiError } from "../utils/apiError.js";
import unlinkFiles from "../utils/fileUnlinker.js";

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      req.data = validatedData;
      next();
    } catch (error) {
      if (req.files) {
        unlinkFiles(req.files);
      }
      res.status(400).json(
        new ApiError(
          400,
          "Validation failed.",
          error.details.map((err) => err.message),
        ),
      );
    }
  };
};

export default validate;
