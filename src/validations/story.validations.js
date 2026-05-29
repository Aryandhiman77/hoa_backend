import Joi from "joi";

export const createStoryValidation = Joi.object({
  story_name: Joi.string().label("Story Name").trim().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),

  story_email: Joi.string()
    .label("Email")
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  story_phone: Joi.string()
    .label("Phone Number")
    .optional()
    .pattern(/^\+?1?\d{10}$/)
    .trim()
    .messages({
      "string.pattern.base": "Please enter a valid phone number.",
      "string.empty": "Phone Number cannot be empty.",
    }),
  story_city: Joi.string().trim().label("City").allow("", null).optional(),

  story_state: Joi.string().label("State").trim().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),

  story_hoa_name: Joi.string()
    .label("Home Owners Association Name")
    .trim()
    .allow("", null)
    .optional(),

  story_issue_type: Joi.array()
    .label("Issue type")
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      "array.min": "Please select at least one issue type",
      "any.required": "Issue type is required",
    }),

  story_summary: Joi.string()
    .label("Story summary")
    .trim()
    .max(300)
    .required()
    .messages({
      "string.empty": "Story summary is required",
      "string.max": "Story summary must not be more than 300 characters",
      "any.required": "Story summary is required",
    }),

  story_body: Joi.string().label("Story body").trim().required().messages({
    "string.empty": "Full story details are required",
    "any.required": "Full story details are required",
  }),

  story_anonymous: Joi.boolean().label("Remain Anonymous").required().messages({
    "any.required": "Anonymous publish choice is required",
  }),

  story_consent: Joi.boolean()
    .label("Story Consent")
    .valid(true)
    .required()
    .messages({
      "any.only": "Consent is required",
      "any.required": "Consent is required",
    }),

  story_disclaimer: Joi.boolean()
    .label("Story Disclaimer")
    .valid(true)
    .required()
    .messages({
      "any.only": "Disclaimer agreement is required",
      "any.required": "Disclaimer agreement is required",
    }),
});

// only for admin side
export const updateStoryValidation = Joi.object({
  story_name: Joi.string().label("Story Name").trim().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  story_city: Joi.string().trim().label("City").allow("", null).optional(),

  story_state: Joi.string().label("State").trim().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),
  story_hoa_name: Joi.string()
    .label("Home Owners Association Name")
    .trim()
    .allow("", null)
    .optional(),

  story_issue_type: Joi.array()
    .label("Issue type")
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      "array.min": "Please select at least one issue type",
      "any.required": "Issue type is required",
    }),

  story_summary: Joi.string()
    .label("Story summary")
    .trim()
    .max(300)
    .required()
    .messages({
      "string.empty": "Story summary is required",
      "string.max": "Story summary must not be more than 300 characters",
      "any.required": "Story summary is required",
    }),

  story_body: Joi.string().label("Story body").trim().required().messages({
    "string.empty": "Full story details are required",
    "any.required": "Full story details are required",
  }),
  story_anonymous: Joi.boolean().label("Remain Anonymous").required().messages({
    "any.required": "Anonymous publish choice is required",
  }),
  status: Joi.string()
    .label("Story Disclaimer")
    .valid("flagged", "approved", "published", "archived")
    .optional(),

  adminNotes: Joi.string()
    .trim()
    .label("Admin Internal Notes")
    .allow("", null)
    .optional(),
});
