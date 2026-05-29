import Joi from "joi";

const contactSchema = Joi.object({
  contact_name: Joi.string()
    .label("Contact Name")
    .lowercase()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.min": "Brand name must be at least 2 characters long.",
      "string.max": "Brand name must be less than 100 characters.",
      "any.required": "Brand name is required.",
      "string.empty": "Brand name cannot be empty.",
    }),
  contact_email: Joi.string()
    .label("Contact Email")
    .email()
    .lowercase()
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
  contact_phone: Joi.string()
    .label("Phone Number")
    .optional()
    .pattern(/^\+?1?\d{10}$/)
    .messages({
      "string.pattern.base": "Please enter a valid phone number.",
      "string.empty": "Phone Number cannot be empty.",
    }),
  contact_subject: Joi.string()
    .label("Contact Subject")
    .lowercase()
    .required()
    .messages({
      "any.required": "Subject is required.",
      "string.empty": "Subject cannot be empty.",
    }),
  contact_message: Joi.string()
    .label("Contact Message")
    .lowercase()
    .min(20)
    .required()
    .messages({
      "any.required": "Contact Message is required.",
      "string.max": "Contact Message must be minimum 20 characters.",
      "string.empty": "Contact Message cannot be empty.",
    }),
});

export default contactSchema;
