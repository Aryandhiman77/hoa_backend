import Joi from "joi";

export const contactPageCMSValidation = Joi.object({
  pageKey: Joi.string().valid("contact").required().label("Page Key").messages({
    "any.only": "Page key must be 'contact'",
    "string.empty": "Page key is required",
  }),

  heading: Joi.string()
    .required()
    .label("Heading")
    .messages({ "string.empty": "Heading is required" }),

  subHeading: Joi.string().allow("").label("Subheading"),

  description: Joi.string()
    .required()
    .label("Description")
    .messages({ "string.empty": "Description is required" }),

  formFields: Joi.array()
    .items(
      Joi.object({
        label: Joi.string()
          .required()
          .label("Form Field Label")
          .messages({ "string.empty": "Form field label is required" }),
        placeholder: Joi.string().allow("").label("Form Field Placeholder"),
      }),
    )
    .min(1)
    .max(4)
    .required()
    .label("Form Fields")
    .messages({
      "array.min": "At least one form field is required",
      "array.max": "There can be atmost 4 form fields.",
      "any.required": "Form fields are required",
    }),

  privacyText: Joi.string().allow("").label("Privacy Text"),
});
