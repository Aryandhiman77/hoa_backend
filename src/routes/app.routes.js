import express from "express";
import contactSchema from "../validations/contact.validations.js";
import validate from "../middlewares/validate.js";
import {
  createNonLegalAdvocate,
  saveContactForm,
  submitYourStory,
  createAttorneySubmission,
  getHomeOwnerAttorneysByFilters,
  getStoryByFilters,
} from "../controllers/app.controller.js";
import { createStoryValidation } from "../validations/story.validations.js";
import { upload } from "../middlewares/multer.js";
import { createNonLegalAdvocateValidation } from "../validations/nonLegalAdvocate.js";
import { createAttorneySubmissionValidation } from "../validations/attorneySubmission.js";
import homeOwnerAttorneysFilters from "../middlewares/filters/homeOwnersAttorneys.js";
import sortingFilters from "../middlewares/filters/common/sorting.js";
import pagination from "../middlewares/filters/common/pagination.js";
import { storyFilters } from "../middlewares/filters/storyFilters.js";
const appRoutes = express.Router();

appRoutes.post("/contact-form", validate(contactSchema), saveContactForm);
appRoutes.post(
  "/submit-story",
  upload.array("uploads", 10),
  validate(createStoryValidation),
  submitYourStory,
);
appRoutes.post(
  "/non-legal-advocate",
  upload.array("uploads", 10),
  validate(createNonLegalAdvocateValidation),
  createNonLegalAdvocate,
);

appRoutes.post(
  "/attorney-submission",
  validate(createAttorneySubmissionValidation),
  createAttorneySubmission,
);

// 5. Search, Filter, and Discovery Requirements
appRoutes.get(
  "/attorneys",
  pagination,
  sortingFilters,
  homeOwnerAttorneysFilters,
  getHomeOwnerAttorneysByFilters,
);

appRoutes.get(
  "/hoa-horror-stories",
  pagination,
  sortingFilters,
  storyFilters,
  getStoryByFilters,
);

export default appRoutes;
