import Joi from "joi";

export const faqValidationSchema = Joi.object({
  question: Joi.string().label("Question").trim().required().messages({
    "string.empty": "Question is required.",
    "any.required": "Question is required.",
  }),

  answer: Joi.string().label("Answer").trim().required().messages({
    "string.empty": "Answer is required.",
    "any.required": "Answer is required.",
  }),

  category: Joi.string().label("Category").trim().required().messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),
  publish_status: Joi.string()
    .label("Publish status")
    .valid("draft", "published")
    .default("draft")
    .messages({
      "any.only": "Publish status must be either 'draft' or 'published'.",
      "any.required": "Publish status must be either 'draft' or 'published'.",
    }),
  sortOrder: Joi.number()
    .label("Sort Order")
    .integer()
    .min(1)
    .optional()
    .messages({
      "number.base": "Sort order must be a number.",
      "number.integer": "Sort order must be an integer.",
      "number.min": "Sort order cannot be zero or negative.",
    }),
});

export const faqStatusValidation = Joi.object({
  publish_status: Joi.string()
    .label("Publish status")
    .valid("draft", "published")
    .required()
    .messages({
      "any.only": "Publish status must be either 'draft' or 'published'.",
      "any.required": "Publish status must be either 'draft' or 'published'.",
    }),
})
  .required()
  .messages({
    "any.required": "Publish status must be either 'draft' or 'published'.",
  });
