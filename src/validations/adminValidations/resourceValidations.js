import Joi from "joi";

export const createResourceValidationSchema = Joi.object({
  title: Joi.string().trim().required().label("Title").messages({
    "string.empty": "Resource title is required.",
    "any.required": "Resource title is required.",
  }),

  summary: Joi.string().trim().required().label("Summary").messages({
    "string.empty": "Resource summary is required.",
    "any.required": "Resource summary is required.",
  }),

  body: Joi.string().trim().required().label("Body").messages({
    "string.empty": "Resource body is required.",
    "any.required": "Resource body is required.",
  }),

  category: Joi.string().trim().required().label("Category").messages({
    "string.empty": "Resource category is required.",
    "any.required": "Resource category is required.",
  }),

  status: Joi.string()
    .valid("draft", "review", "published", "archived", "unpublish")
    .default("draft")
    .label("Status")
    .messages({
      "any.only":
        "Status must be one of draft, review, published, archived, or unpublish.",
    }),

  seo_title: Joi.string().trim().optional().allow(null, "").label("SEO Title"),

  meta_description: Joi.string()
    .trim()
    .optional()
    .allow(null, "")
    .label("Meta Description"),
});

export const updateResourceValidationSchema = Joi.object({
  title: Joi.string().trim().required().label("Title").messages({
    "string.empty": "Resource title is required.",
    "any.required": "Resource title is required.",
  }),

  slug: Joi.string().trim().required().label("Slug").messages({
    "string.empty": "Slug is required.",
    "any.required": "Slug is required.",
  }),

  summary: Joi.string().trim().required().label("Summary").messages({
    "string.empty": "Resource summary is required.",
    "any.required": "Resource summary is required.",
  }),

  body: Joi.string().trim().required().label("Body").messages({
    "string.empty": "Resource body is required.",
    "any.required": "Resource body is required.",
  }),

  category: Joi.string().trim().required().label("Category").messages({
    "string.empty": "Resource category is required.",
    "any.required": "Resource category is required.",
  }),

  status: Joi.string()
    .valid("draft", "review", "published", "archived", "unpublish")
    .required()
    .label("Status")
    .messages({
      "any.only":
        "Status must be one of draft, review, published, archived, or unpublish.",
      "any.required": "Status is required.",
    }),

  seo_title: Joi.string().trim().required().label("SEO Title").messages({
    "string.empty": "SEO title is required.",
    "any.required": "SEO title is required.",
  }),

  meta_description: Joi.string()
    .trim()
    .required()
    .label("Meta Description")
    .messages({
      "string.empty": "Meta description is required.",
      "any.required": "Meta description is required.",
    }),
});

export const updateResourceStatusSchema = Joi.object({
  status: Joi.string()
    .valid("draft", "review", "published", "archived", "unpublish")
    .required()
    .label("Status")
    .messages({
      "any.required": "Status is required.",
      "any.only":
        "Status must be one of draft, review, published, archived, or unpublish.",
    }),
});
