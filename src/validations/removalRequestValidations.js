import Joi from "joi";

const removalRequestValidation = Joi.object({
  caseId: Joi.string()
    .trim()
    .length(21)
    .pattern(/^STORY-[A-Z0-9]{15}$/i)
    .required()
    .messages({
      "any.required": "{{#label}} is required.",
      "string.empty": "{{#label}} cannot be empty.",
      "string.length": "{{#label}} must be exactly 21 characters long.",
      "string.pattern.base": "{{#label}} must be a valid Story Case ID.",
      "string.base": "{{#label}} must be a string.",
    })
    .label("Case ID"),

  name: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "{{#label}} is required.",
      "string.empty": "{{#label}} cannot be empty.",
      "string.base": "{{#label}} must be a string.",
    })
    .label("Name"),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "{{#label}} is required.",
      "string.empty": "{{#label}} cannot be empty.",
      "string.email": "{{#label}} must be a valid email address.",
      "string.base": "{{#label}} must be a string.",
    })
    .label("Email"),

  reason: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "{{#label}} is required.",
      "string.empty": "{{#label}} cannot be empty.",
      "string.base": "{{#label}} must be a string.",
    })
    .label("Correction or removal Reason"),
});

export default removalRequestValidation;
