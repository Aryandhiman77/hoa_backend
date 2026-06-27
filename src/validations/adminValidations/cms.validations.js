import Joi from "joi";

export const cmsPageValidation = Joi.object({
  pageKey: Joi.string().required().label("Page Key").messages({
    "string.empty": "Page key is required",
  }),

  // Titles are optional, only required for pages with headings
  titleMain: Joi.string().allow("").label("Main Title"),
  titleSubtitle: Joi.string().allow("").label("Subtitle Title"),

  // Sections optional
  sections: Joi.array()
    .items(
      Joi.object({
        sectionKey: Joi.string().required().label("Section Key").messages({
          "string.empty": "Section key is required",
        }),
        titleMain: Joi.string().allow("").label("Section Main Title"),
        titleSubtitle: Joi.string().allow("").label("Section Subtitle Title"),
        content: Joi.any().label("Section Content"),
        disclaimerText: Joi.string().allow("").label("Section Disclaimer Text"),
        checkboxText: Joi.string().allow("").label("Section Checkbox Text"),
      }),
    )
    .optional()
    .label("Sections"),

  // Form definition optional
  formDefinition: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required().label("Field Key").messages({
          "string.empty": "Field key is required",
        }),
        label: Joi.string().required().label("Field Label").messages({
          "string.empty": "Field label is required",
        }),
        type: Joi.string()
          .valid("text", "textarea", "select", "checkbox", "file")
          .required()
          .label("Field Type")
          .messages({
            "any.only":
              "Field type must be one of text, textarea, select, checkbox, file",
            "any.required": "Field type is required",
          }),
        placeholder: Joi.string().allow("").label("Placeholder"),
        description: Joi.string().allow("").label("Description"),
        options: Joi.array()
          .items(Joi.string())
          .when("type", {
            is: "select",
            then: Joi.required().label("Options").messages({
              "any.required": "Select field must have options",
            }),
            otherwise: Joi.forbidden(),
          }),
        required: Joi.boolean().label("Required"),
      }),
    )
    .optional()
    .label("Form Definition"),

  // Plain text disclaimer optional
  disclaimerText: Joi.string().allow("").label("Disclaimer Text"),
});
