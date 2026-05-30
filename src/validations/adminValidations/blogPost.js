import Joi from "joi";

export const blogValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),

  slug: Joi.string().trim().lowercase().required().messages({
    "string.empty": "Slug is required.",
    "any.required": "Slug is required.",
  }),

  excerpt: Joi.string().trim().required().messages({
    "string.empty": "Excerpt is required.",
    "any.required": "Excerpt is required.",
  }),

  body: Joi.string().trim().required().messages({
    "string.empty": "Body is required.",
    "any.required": "Body is required.",
  }),

  category: Joi.string().trim().required().messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),

  tags: Joi.array()
    .items(
      Joi.string().trim().messages({
        "string.base": "Each tag must be a string.",
        "string.empty": "Tags cannot be empty strings.",
      }),
    )
    .optional()
    .messages({
      "array.base": "Tags must be an array.",
      "array.includes": "All tags must be valid strings.",
    }),

  seo_title: Joi.string().trim().optional().allow(null, ""),

  meta_description: Joi.string().trim().optional().allow(null, ""),
});

export const updateBlogValidation = blogValidationSchema.concat(
  Joi.object({
    status: Joi.string()
      .valid("draft", "review", "published", "archieved")
      .optional()
      .messages({
        "any.only": "Status must be either 'draft', 'published' or 'archived'.",
      }),
  }),
);
