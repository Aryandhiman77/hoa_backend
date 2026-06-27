import { ApiError } from "../helpers/apiError.js";
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
      if (req.file) {
        unlinkFiles(req.file);
      }
      if (req.files?.featured_image1?.[0]) {
        unlinkFiles(req.files?.featured_image1?.[0]);
      }
      if (req.files?.featured_image2?.[0]) {
        unlinkFiles(req.files?.featured_image2?.[0]);
      }
      res.status(400).json(
        new ApiError(
          400,
          "Validation failed.",
          error.details.map((err) => ({
            message: err.message,
            label: err.context.label,
            key: err.context.key,
          })),
          "VALIDATION_FAILED",
        ),
      );
    }
  };
};

export default validate;
