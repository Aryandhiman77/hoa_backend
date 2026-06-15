import Joi from "joi";

const pageSectionValidation = Joi.object({
  type: Joi.string().trim().required().messages({
    "string.empty": "Section type is required.",
    "any.required": "Section type is required.",
  }),

  title: Joi.string().trim().allow("", null).optional(),

  body: Joi.string().trim().allow("", null).optional(),

  buttonText: Joi.string().trim().allow("", null).optional(),

  buttonUrl: Joi.string().trim().allow("", null).optional(),

  items: Joi.array().items(Joi.any()).default([]).optional(),
});

export const createPageValidation = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Page title is required.",
    "any.required": "Page title is required.",
  }),

  hero_title: Joi.string().trim().required().messages({
    "string.empty": "Hero title is required.",
    "any.required": "Hero title is required.",
  }),

  hero_body: Joi.string().trim().required().messages({
    "string.empty": "Hero body is required.",
    "any.required": "Hero body is required.",
  }),

  sections: Joi.array().items(pageSectionValidation).default([]).optional(),

  seo_title: Joi.string().trim().required().messages({
    "string.empty": "SEO title is required.",
    "any.required": "SEO title is required.",
  }),

  meta_description: Joi.string().trim().required().messages({
    "string.empty": "Meta description is required.",
    "any.required": "Meta description is required.",
  }),

  publish_status: Joi.string().valid("draft", "published").optional().messages({
    "any.only": "Publish status must be either draft or published.",
  }),                                                                                                   
});

export const updatePageValidation = Joi.object({
  title: Joi.string().trim().optional(),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),

  hero_title: Joi.string().trim().optional(),

  hero_body: Joi.string().trim().optional(),

  sections: Joi.array().items(pageSectionValidation).optional(),

  seo_title: Joi.string().trim().optional(),

  meta_description: Joi.string().trim().optional(),

  publish_status: Joi.string().valid("draft", "published").optional().messages({
    "any.only": "Publish status must be either draft or published.",
  }),
});
