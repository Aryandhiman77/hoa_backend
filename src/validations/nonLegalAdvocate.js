import Joi from "joi";

export const createNonLegalAdvocateValidation = Joi.object({
  adv_name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),

  adv_email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),

  adv_phone: Joi.string().trim().required().messages({
    "string.empty": "Phone is required.",
    "any.required": "Phone is required.",
  }),

  adv_state: Joi.string().trim().required().messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),

  adv_hoa_name: Joi.string().trim().allow("", null).optional(),

  adv_issue_summary: Joi.string().trim().required().messages({
    "string.empty": "Issue summary is required.",
    "any.required": "Issue summary is required.",
  }),

  adv_estimated_damages: Joi.string().trim().allow("", null).optional(),

  adv_key_dates: Joi.string().trim().allow("", null).optional(),

  adv_disclaimer: Joi.boolean().valid(true).required().messages({
    "any.only": "Disclaimer is required.",
    "any.required": "Disclaimer is required.",
  }),
});
