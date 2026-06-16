import Joi from "joi";

export const createResourceValidationSchema = Joi.object({
  title: Joi.string().trim().required().label("Title").messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),

  summary: Joi.string().trim().required().label("Summary").messages({
    "string.empty": "Summary is required.",
    "any.required": "Summary is required.",
  }),

  body: Joi.string().trim().required().label("Body").messages({
    "string.empty": "Body is required.",
    "any.required": "Body is required.",
  }),

  category: Joi.string().trim().required().label("Category").messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),

  status: Joi.string()
    .valid("draft", "review", "published", "archieved", "unpublish")
    .default("draft")
    .label("Status")
    .messages({
      "any.only":
        "Status must be one of draft, review, published, archieved, or unpublish.",
    }),

  seo_title: Joi.string().trim().optional().allow("", null).label("SEO Title"),

  meta_description: Joi.string()
    .trim()
    .optional()
    .allow("", null)
    .label("Meta Description"),
});

export const updateResourceValidationSchema = createResourceValidationSchema
  .concat(
    Joi.object({
      slug: Joi.string()
        .trim()
        .required()
        .allow(null, "")
        .label("Slug")
        .messages({
          "any.required": "Slug is required.",
        }),
    }),
  )
  .required()
  .messages({
    "any.required": "Slug is required",
  });
