import Joi from "joi";

export const privacyPolicyValidationSchema = Joi.object({
  body: Joi.string()
    .trim()
    .required()
    .label("Privacy Policy Content")
    .messages({
      "string.base": "Privacy Policy content must be text.",
      "string.empty": "Privacy Policy content cannot be empty.",
      "any.required": "Privacy Policy content is required.",
    }),
});

// Validation for Terms of Use creation/updation
export const termsOfUseValidationSchema = Joi.object({
  body: Joi.string().trim().required().label("Terms of Use Content").messages({
    "string.base": "Terms of Use content must be text.",
    "string.empty": "Terms of Use content cannot be empty.",
    "any.required": "Terms of Use content is required.",
  }),
});
