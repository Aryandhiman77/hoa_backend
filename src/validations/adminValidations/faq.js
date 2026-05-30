import Joi from "joi";

export const faqValidationSchema = Joi.object({
  question: Joi.string().trim().required().messages({
    "string.empty": "Question is required.",
    "any.required": "Question is required.",
  }),

  answer: Joi.string().trim().required().messages({
    "string.empty": "Answer is required.",
    "any.required": "Answer is required.",
  }),

  category: Joi.string().trim().required().messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),

  sortOrder: Joi.number().integer().min(0).optional().messages({
    "number.base": "Sort order must be a number.",
    "number.integer": "Sort order must be an integer.",
    "number.min": "Sort order cannot be negative.",
  }),
  publish_status: Joi.string().valid("draft", "published").required().messages({
    "any.only": "Publish status must be either 'draft' or 'published'.",
    "any.required": "Publish status must be either 'draft' or 'published'.",
  }),
});

export const faqStatusValidation = Joi.object({
  publish_status: Joi.string().valid("draft", "published").required().messages({
    "any.only": "Publish status must be either 'draft' or 'published'.",
    "any.required": "Publish status must be either 'draft' or 'published'.",
  }),
})
  .required()
  .messages({
    "any.required": "Publish status must be either 'draft' or 'published'.",
  });
