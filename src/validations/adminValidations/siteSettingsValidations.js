import Joi from "joi";

const urlPattern = /^\/|^https?:\/\//; // allow relative or absolute URLs

export const websiteSettingsValidation = Joi.object({
  logo: Joi.object({
    altText: Joi.string().allow("").label("Logo Alt Text").messages({
      "string.base": "Logo alt text must be a string",
    }),
  })
    .required()
    .label("Logo"),

  contactInfo: Joi.object({
    email: Joi.string().email().allow("").label("Contact Email").messages({
      "string.email": "Contact Email must be a valid email address",
    }),
    phone: Joi.string().allow("").label("Contact Phone").messages({
      "string.base": "Contact Phone must be a string",
    }),
    address: Joi.string().allow("").label("Contact Address").messages({
      "string.base": "Contact Address must be a string",
    }),
  })
    .required()
    .label("Contact Information"),

  socialLinks: Joi.array()
    .items(
      Joi.object({
        platform: Joi.string().required().label("Social Platform").messages({
          "any.required": "Social Platform is required",
        }),
        url: Joi.string()
          .pattern(urlPattern)
          .required()
          .label("Social URL")
          .messages({
            "any.required": "Social URL is required",
            "string.pattern.base":
              "Social URL must be a valid relative or absolute URL",
          }),
      }),
    )
    .optional()
    .label("Social Links"),

  footer: Joi.object({
    text: Joi.string().allow("").label("Footer Text"),
    links: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().required().label("Footer Link Label").messages({
            "any.required": "Footer link label is required",
          }),
          url: Joi.string()
            .pattern(urlPattern)
            .required()
            .label("Footer Link URL")
            .messages({
              "any.required": "Footer link URL is required",
              "string.pattern.base":
                "Footer link URL must be a valid relative or absolute URL",
            }),
        }),
      )
      .optional(),
  })
    .optional()
    .label("Footer"),

  disclaimer: Joi.string().allow("").label("Disclaimer"),
  attorneyDisclaimer: Joi.string().allow("").label("Attorney Disclaimer"),

  navigationLabels: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().required().label("Navigation Label").messages({
          "any.required": "Navigation label is required",
        }),
        url: Joi.string()
          .pattern(urlPattern)
          .required()
          .label("Navigation URL")
          .messages({
            "any.required": "Navigation URL is required",
            "string.pattern.base":
              "Navigation URL must be a valid relative or absolute URL",
          }),
        dropdown: Joi.array()
          .items(
            Joi.object({
              label: Joi.string().required().label("Navigation Dropdown Label"),
              url: Joi.string()
                .pattern(urlPattern)
                .required()
                .label("Navigation Dropdown URL")
                .messages({
                  "any.required": "Navigation dropdown URL is required",
                  "string.pattern.base":
                    "Navigation dropdown URL must be a valid relative or absolute URL",
                }),
            }),
          )
          .optional(),
      }),
    )
    .optional()
    .label("Navigation Labels"),

  defaultSEO: Joi.object({
    metaTitle: Joi.string().allow("").label("SEO Meta Title"),
    metaDescription: Joi.string().allow("").label("SEO Meta Description"),
    metaKeywords: Joi.array().items(Joi.string()).label("SEO Meta Keywords"),
  }).optional(),
});
