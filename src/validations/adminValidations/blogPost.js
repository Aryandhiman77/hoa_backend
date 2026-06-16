import Joi from "joi";

export const createblogValidationSchema = Joi.object({
  title: Joi.string().trim().required().label("Title").messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),

  excerpt: Joi.string().trim().required().label("Excerpt").messages({
    "string.empty": "Excerpt is required.",
    "any.required": "Excerpt is required.",
  }),

  body: Joi.string().trim().required().label("Body").messages({
    "string.empty": "Body is required.",
    "any.required": "Body is required.",
  }),

  category: Joi.string().trim().required().label("Category").messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),

  tags: Joi.array()
    .items(
      Joi.string().trim().label("Tags").messages({
        "string.base": "Each tag must be a string.",
        "string.empty": "Tags cannot be empty strings.",
      }),
    )
    .optional()
    .label("Tags")
    .messages({
      "array.base": "Tags must be an array.",
      "array.includes": "All tags must be valid strings.",
    }),

  status: Joi.string()
    .valid("draft", "review", "published", "archived")
    .default("draft")
    .label("Status")
    .messages({
      "any.only":
        "Status must be one of draft, review, published, unpublished, archieved.",
    }),

  seo_title: Joi.string().trim().optional().allow(null, "").label("SEO Title"),

  meta_description: Joi.string()
    .trim()
    .optional()
    .allow(null, "")
    .label("Meta Description"),
});

export const updateBlogValidationSchema = createblogValidationSchema.concat(
  Joi.object({
    slug: Joi.string().trim().required().messages({
      "string.empty": "Slug is required for updating the blog.",
      "any.required": "Slug is required for updating the blog.",
    }),
    status: Joi.string()
      .valid("draft", "review", "published", "archived", "unpublish")
      .optional()
      .messages({
        "any.only":
          "Status must be either 'draft', 'review', 'published', or 'archived'.",
      }),
  }),
);

export const blogStatusValidation = Joi.object({
  status: Joi.string()
    .valid("draft", "review", "published", "archived", "unpublish")
    .required()
    .label("Status")
    .messages({
      "any.only":
        "Status must be either draft, published, unpublish, review or archived.",
      "any.required": "Status is required.",
    }),
})
  .required()
  .messages({
    "any.required": "Status is required",
  });
