import Joi from "joi";

// const pageSectionValidation = Joi.object({
//   type: Joi.string().trim().required().messages({
//     "string.empty": "Section type is required.",
//     "any.required": "Section type is required.",
//   }),

//   title: Joi.string().trim().allow("", null).optional(),

//   body: Joi.string().trim().allow("", null).optional(),

//   buttonText: Joi.string().trim().allow("", null).optional(),

//   buttonUrl: Joi.string().trim().allow("", null).optional(),

//   items: Joi.array().items(Joi.any()).default([]).optional(),
// });

export const createPageValidation = Joi.object({
  title: Joi.string().trim().required().label("Title").messages({
    "string.empty": "Page title is required.",
    "any.required": "Page title is required.",
  }),

  hero_title: Joi.string().trim().required().label("Hero Title").messages({
    "string.empty": "Hero title is required.",
    "any.required": "Hero title is required.",
  }),

  hero_body: Joi.string().trim().required().label("Hero Body").messages({
    "string.empty": "Hero body is required.",
    "any.required": "Hero body is required.",
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

  publish_status: Joi.string()
    .valid("draft", "published", "review")
    .default("draft")
    .label("Publish Status")
    .messages({
      "any.only": "Publish status must be either draft, published, or review.",
    }),
});

export const updatePageValidation = Joi.object({
  title: Joi.string().trim().required().label("Title").messages({
    "string.empty": "Page title is required.",
    "any.required": "Page title is required.",
  }),

  slug: Joi.string().trim().required().label("Slug").messages({
    "string.empty": "Slug is required.",
    "any.required": "Slug is required.",
  }),

  hero_title: Joi.string().trim().required().label("Hero Title").messages({
    "string.empty": "Hero title is required.",
    "any.required": "Hero title is required.",
  }),

  hero_body: Joi.string().trim().required().label("Hero Body").messages({
    "string.empty": "Hero body is required.",
    "any.required": "Hero body is required.",
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

  publish_status: Joi.string()
    .valid("draft", "review", "published", "archieved", "unpublish")
    .required()
    .label("Publish Status")
    .messages({
      "any.only":
        "Publish status must be either draft, published, review or archived.",
      "any.required": "Publish status is required.",
    }),
});
