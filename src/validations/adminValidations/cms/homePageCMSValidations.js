import Joi from "joi";

export const homePageCMSValidation = Joi.object({
  pageKey: Joi.string().valid("home").required().label("Page Key").messages({
    "any.only": "Page key must be 'home'",
    "string.empty": "Page key is required",
  }),

  hero: Joi.object({
    subtitle: Joi.string().required().label("Hero Subtitle").messages({
      "string.empty": "Hero subtitle is required",
    }),

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
      .min(1)
      .required()
      .label("Hero Buttons")
      .messages({ "array.min": "At least one hero button is required" }),

    disclaimerCheckboxText: Joi.string()
      .required()
      .label("Disclaimer Checkbox Text")
      .messages({
        "string.empty": "Disclaimer checkbox text is required",
      }),

    introText: Joi.string().required().label("Hero Intro Text").messages({
      "string.empty": "Intro text is required",
    }),
  }).required(),

  highlight: Joi.object({
    heading: Joi.string().required().label("Highlight Heading").messages({
      "string.empty": "Highlight heading is required",
    }),
    subHeading: Joi.string().required().label("Highlight Subheading").messages({
      "string.empty": "Highlight subheading is required",
    }),
  }).required(),

  propertyComparison: Joi.object({
    disclaimer: Joi.string()
      .required()
      .label("Property Comparison Disclaimer")
      .messages({
        "string.empty": "Property comparison disclaimer is required",
      }),

    mainText: Joi.string()
      .required()
      .label("Property Comparison Main Text")
      .messages({
        "string.empty": "Property comparison main text is required",
      }),

    highlightText: Joi.string()
      .required()
      .label("Property Comparison Highlight Text")
      .messages({
        "string.empty": "Property comparison highlight text is required",
      }),
  }).required(),

  featured_image1_alt: Joi.string()
    .allow("")
    .label("Featured Image 1 Alt Text")
    .required(),
  featured_image2_alt: Joi.string()
    .allow("")
    .label("Featured Image 2 Alt Text")
    .required(),
});
