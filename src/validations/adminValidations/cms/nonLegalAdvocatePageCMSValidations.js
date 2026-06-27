import Joi from "joi";

export const nonLegalAdvocateCMSValidation = Joi.object({
  pageKey: Joi.string()
    .valid("non-legal-advocate")
    .required()
    .label("Page Key")
    .messages({
      "any.only": "Page key must be 'non-legal-advocate'",
      "string.empty": "Page key is required",
    }),

  featured_image_alt: Joi.string()
    .allow("")
    .label("Featured Image Alt Text")
    .required(),
  background_image_alt: Joi.string()
    .allow("")
    .label("Background Image Alt Text")
    .required(),

  heroHeading: Joi.string().max(40).required().label("Hero Heading").messages({
    "string.empty": "Hero heading is required",
    "string.max": "Hero heading cannot exceed 40 characters",
  }),

  subtitle: Joi.string()
    .required()
    .label("Subtitle")
    .messages({ "string.empty": "Subtitle is required" }),

  description: Joi.string()
    .required()
    .label("Description")
    .messages({ "string.empty": "Description is required" }),

  buttons: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required().label("Button Text").messages({
          "string.empty": "Button text is required",
        }),
        link: Joi.string().required().label("Button Link").messages({
          "string.empty": "Button link is required",
        }),
        style: Joi.string()
          .valid(
            "red-text-white",
            "red-bordered",
            "green-text-white",
            "green-bordered",
          )
          .label("Button Style"),
      }),
    )
    .min(0)
    .label("Buttons"),

  cards: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().max(48).required().label("Card Title").messages({
          "string.empty": "Card title is required",
          "string.max": "Card title cannot exceed 48 characters",
        }),
        description: Joi.string()
          .max(100)
          .required()
          .label("Card Description")
          .messages({
            "string.empty": "Card description is required",
            "string.max": "Card description cannot exceed 100 characters",
          }),
      }),
    )
    .min(0)
    .label("Cards"),
});
