import Joi from "joi";

export const nonLegalAdvocateValidationSchema = Joi.object({
  adv_name: Joi.string().trim().required().label("Name").messages({
    "string.empty": "Advocate name is required.",
    "any.required": "Advocate name is required.",
  }),

  adv_email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email")
    .messages({
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),

  adv_phone: Joi.string().trim().required().label("Phone").messages({
    "string.empty": "Phone number is required.",
    "any.required": "Phone number is required.",
  }),

  adv_state: Joi.string().trim().required().label("State").messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),

  adv_hoa_name: Joi.string()
    .trim()
    .optional()
    .allow(null, "")
    .label("HOA Name"),

  adv_issue_summary: Joi.string()
    .trim()
    .required()
    .label("Issue Summary")
    .messages({
      "string.empty": "Issue summary is required.",
      "any.required": "Issue summary is required.",
    }),

  adv_estimated_damages: Joi.string()
    .trim()
    .optional()
    .allow(null, "")
    .label("Estimated Damages"),

  adv_key_dates: Joi.string()
    .trim()
    .optional()
    .allow(null, "")
    .label("Key Dates"),

  status: Joi.string()
    .valid(
      "new",
      "under_review",
      "needs_follow_up",
      "flagged",
      "closed",
      "archieved",
    )
    .default("new")
    .label("Status")
    .messages({
      "any.only":
        "Status must be one of new, under_review, needs_follow_up, flagged, closed, or archieved.",
    }),
});
