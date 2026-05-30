import Joi from "joi";

export const createNonLegalAdvocateValidation = Joi.object({
  adv_name: Joi.string().label("Name").trim().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),

  adv_email: Joi.string()
    .label("Email")
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),

  adv_phone: Joi.string()
    .label("Phone")
    .required()
    .pattern(/^\+?1?\d{10}$/)
    .messages({
      "string.pattern.base": "Please enter a valid phone number.",
      "string.empty": "Phone Number cannot be empty.",
      "any.required": "Phone Number is required.",
    }),

  adv_state: Joi.string().label("State").trim().required().messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),

  adv_hoa_name: Joi.string()
    .label("HOA / Community")
    .trim()
    .allow("", null)
    .optional(),

  adv_issue_summary: Joi.string()
    .label("Issue Summary")
    .trim()
    .required()
    .messages({
      "string.empty": "Issue summary is required.",
      "any.required": "Issue summary is required.",
    }),

  adv_estimated_damages: Joi.string()
    .label("Estimated Damages")
    .trim()
    .allow("", null)
    .optional(),

  adv_key_dates: Joi.string()
    .label("Key Dates")
    .trim()
    .allow("", null)
    .optional(),

  adv_disclaimer: Joi.boolean()
    .label("Disclaimer Checkbox")
    .valid(true)
    .required()
    .messages({
      "any.only": "Disclaimer is required.",
      "any.required": "Disclaimer is required.",
    }),
});
