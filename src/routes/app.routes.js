import express from "express";
import contactSchema from "../validations/contact.validations.js";
import validate from "../middlewares/validate.js";
import {
  createNonLegalAdvocate,
  saveContactForm,
  createStory,
  createAttorneySubmission,
  getHomeOwnerAttorneysByFilters,
  getStoryByFilters,
} from "../controllers/app.controller.js";
import { createStoryValidation } from "../validations/story.validations.js";
import { uploadMultiple } from "../middlewares/multer.js";
import { createNonLegalAdvocateValidation } from "../validations/nonLegalAdvocate.js";
import { createAttorneySubmissionValidation } from "../validations/attorneySubmission.js";
import homeOwnerAttorneysFilters from "../middlewares/filters/homeOwnersAttorneys.js";
import sortingFilters from "../middlewares/filters/common/sorting.js";
import pagination from "../middlewares/filters/common/pagination.js";
import { storyFilters } from "../middlewares/filters/storyFilters.js";
import { jsonParser } from "../utils/jsonParser.js";
import { appConfig } from "../configs/index.js";
const appRoutes = express.Router();

appRoutes.post("/contact-form", validate(contactSchema), saveContactForm); //✅

appRoutes
  .post(
    "/submit-story",
    uploadMultiple.array("media", appConfig.max_story_uploads_length),
    jsonParser(["story_issue_type"]),
    validate(createStoryValidation),
    createStory,
  )
  .get(
    "/hoa-horror-stories",
    pagination,
    sortingFilters,
    storyFilters,
    getStoryByFilters,
  ); //✅

appRoutes.post(
  "/non-legal-advocate",
  uploadMultiple.array("media", appConfig.max_story_uploads_length),
  validate(createNonLegalAdvocateValidation),
  createNonLegalAdvocate,
);

appRoutes
  .post(
    "/attorney-submission",
    validate(createAttorneySubmissionValidation),
    createAttorneySubmission,
  )
  .get(
    // 5. Search, Filter, and Discovery Requirements
    "/attorneys",
    pagination,
    sortingFilters,
    homeOwnerAttorneysFilters,
    getHomeOwnerAttorneysByFilters,
  );

export default appRoutes;
