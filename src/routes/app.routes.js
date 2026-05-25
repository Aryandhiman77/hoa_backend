import express from "express";
import contactSchema from "../validations/contact.validations.js";
import validate from "../middlewares/validate.js";
import {
  saveContactForm,
  submitYourStory,
} from "../controllers/app.controller.js";
import { createStoryValidation } from "../validations/story.validations.js";
import { storyUpload } from "../middlewares/multer.js";
const appRoutes = express.Router();

appRoutes.post("/contact-form", validate(contactSchema), saveContactForm);
appRoutes.post(
  "/submit-story",
  storyUpload.array("uploads", 10),
  validate(createStoryValidation),
  submitYourStory,
);

export default appRoutes;

