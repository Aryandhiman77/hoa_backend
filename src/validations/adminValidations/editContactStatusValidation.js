import Joi from "joi";

export const editContactStatusValidation = Joi.object({
  status: Joi.string()
    .valid("new", "under_review", "needs_followup", "closed")
    .required()
    .label("Status")
    .messages({
      "any.required": "Status is required.",
      "any.only":
        "Status must be one of new, under_review, needs_followup, or closed.",
    }),
});
