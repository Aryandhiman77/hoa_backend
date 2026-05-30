import Joi from "joi";

export const updateAttorneySubmissionValidation = Joi.object({
  attorney_name: Joi.string()
    .label("Attorney Name")
    .trim()
    .required()
    .messages({
      "string.empty": "Attorney name is required.",
      "any.required": "Attorney name is required.",
    }),

  attorney_firm: Joi.string().label("Firm Name").trim().required().messages({
    "string.empty": "Firm name is required.",
    "any.required": "Firm name is required.",
  }),

  attorney_email: Joi.string()
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

  attorney_phone: Joi.string()
    .label("Phone")
    .required()
    .pattern(/^\+?1?\d{10}$/)
    .messages({
      "string.pattern.base": "Please enter a valid phone number.",
      "string.empty": "Phone Number cannot be empty.",
      "any.required": "Phone Number is required.",
    }),

  attorney_website: Joi.string()
    .label("Website")
    .trim()
    .uri()
    .allow("", null)
    .optional()
    .messages({
      "string.uri": "Please enter a valid website URL.",
    }),

  attorney_city: Joi.string().label("City").trim().required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),

  attorney_state: Joi.string().label("State").trim().required().messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),

  attorney_county: Joi.string()
    .label("Country")
    .trim()
    .allow("", null)
    .optional(),

  attorney_practice_areas: Joi.alternatives()
    .label("Practice Areas")
    .try(Joi.array().items(Joi.string().trim()).min(1), Joi.string().trim())
    .required()
    .messages({
      "any.required": "Practice area is required.",
      "array.min": "Please select at least one practice area.",
    }),

  attorney_summary: Joi.string()
    .label("Listing Summary")
    .trim()
    .required()
    .messages({
      "string.empty": "Listing summary is required.",
      "any.required": "Listing summary is required.",
    }),

  attorney_bio: Joi.string().label("Bio").trim().allow("", null).optional(),
});

export const declineAttorneySchema = Joi.object({
  declineReason: Joi.string()
    .label("Decline reason")
    .lowercase()
    .min(10)
    .required()
    .messages({
      "any.required": "Decline reason is required.",
      "string.min": "Decline reason must be minimum 20 characters.",
      "string.empty": "Decline reason cannot be empty.",
      "string.base": "Decline reason must be a string.",
    }),
})
  .required()
  .messages({
    "any.required": "Decline reason is required.",
  });
