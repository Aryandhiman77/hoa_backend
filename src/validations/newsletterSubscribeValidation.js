import Joi from "joi";

export const newsletterSubscribeValidation = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "any.required": "{{#label}} is required.",
      "string.empty": "{{#label}} cannot be empty.",
      "string.email": "{{#label}} must be a valid email address.",
      "string.base": "{{#label}} must be a string.",
    })
    .label("Email"),

  firstName: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.empty": "{{#label}} cannot be empty.",
      "string.max": "{{#label}} must not exceed 100 characters.",
      "string.base": "{{#label}} must be a string.",
    })
    .label("First Name"),

  consent: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      "any.required": "{{#label}} is required.",
      "any.only": "{{#label}} must be accepted.",
      "boolean.base": "{{#label}} must be a boolean.",
    })
    .label("Newsletter Consent"),
})
  .required()
  .messages({
    "any.required": "request body is required.",
  });
