import Joi from "joi";

export const aboutPageCMSValidation = Joi.object({
  pageKey: Joi.string().valid("about").required().label("Page Key").messages({
    "any.only": "Page key must be 'about'",
    "string.empty": "Page key is required",
  }),
  content: Joi.string().required().label("About Page Content").messages({
    "string.empty": "About page content is required",
  }),
});
