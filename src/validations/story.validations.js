import Joi from "joi";

export const createStoryValidation = Joi.object({
  story_name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),

  story_email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  story_phone: Joi.string().trim().allow("", null).optional(),

  story_city: Joi.string().trim().allow("", null).optional(),

  story_state: Joi.string().trim().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),

  story_hoa_name: Joi.string().trim().allow("", null).optional(),

  story_issue_type: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      "array.min": "Please select at least one issue type",
      "any.required": "Issue type is required",
    }),

  story_summary: Joi.string().trim().max(300).required().messages({
    "string.empty": "Story summary is required",
    "string.max": "Story summary must not be more than 300 characters",
    "any.required": "Story summary is required",
  }),

  story_body: Joi.string().trim().required().messages({
    "string.empty": "Full story details are required",
    "any.required": "Full story details are required",
  }),

  story_anonymous: Joi.boolean().required().messages({
    "any.required": "Anonymous publish choice is required",
  }),

  story_consent: Joi.boolean().valid(true).required().messages({
    "any.only": "Consent is required",
    "any.required": "Consent is required",
  }),

  story_disclaimer: Joi.boolean().valid(true).required().messages({
    "any.only": "Disclaimer agreement is required",
    "any.required": "Disclaimer agreement is required",
  }),
});

export const updateStoryValidation = Joi.object({
  status: Joi.string()
    .valid("new", "reviewing", "approved", "rejected", "published")
    .optional(),

  isPublished: Joi.boolean().optional(),

  adminNotes: Joi.string().trim().allow("", null).optional(),

  reviewedBy: Joi.string().hex().length(24).allow(null).optional(),

  reviewedAt: Joi.date().allow(null).optional(),

  isDeleted: Joi.boolean().optional(),
});
