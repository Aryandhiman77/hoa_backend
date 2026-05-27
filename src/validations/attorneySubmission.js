import Joi from "joi";

export const createAttorneySubmissionValidation = Joi.object({
  attorney_name: Joi.string().trim().required().messages({
    "string.empty": "Attorney name is required.",
    "any.required": "Attorney name is required.",
  }),

  attorney_firm: Joi.string().trim().required().messages({
    "string.empty": "Firm name is required.",
    "any.required": "Firm name is required.",
  }),

  attorney_email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),

  attorney_phone: Joi.string().trim().required().messages({
    "string.empty": "Phone is required.",
    "any.required": "Phone is required.",
  }),

  attorney_website: Joi.string()
    .trim()
    .uri()
    .allow("", null)
    .optional()
    .messages({
      "string.uri": "Please enter a valid website URL.",
    }),

  attorney_city: Joi.string().trim().required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),

  attorney_state: Joi.string().trim().required().messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),

  attorney_county: Joi.string().trim().allow("", null).optional(),

  attorney_practice_areas: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim()).min(1), Joi.string().trim())
    .required()
    .messages({
      "any.required": "Practice area is required.",
      "array.min": "Please select at least one practice area.",
    }),

  attorney_summary: Joi.string().trim().required().messages({
    "string.empty": "Listing summary is required.",
    "any.required": "Listing summary is required.",
  }),

  attorney_bio: Joi.string().trim().allow("", null).optional(),

  attorney_disclaimer_ack: Joi.boolean().valid(true).required().messages({
    "any.only": "Attorney disclaimer acknowledgement is required.",
    "any.required": "Attorney disclaimer acknowledgement is required.",
  }),
});
