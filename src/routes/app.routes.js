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
  getBlogListing,
  getSingleBlog,
  getFaqs,
  getPrivacyPolicy,
  getTermsOfUse,
  getResources,
  getClientWebsiteSettings,
  getPageContent,
  getHomeContent,
  getAboutPageContent,
  getNonLegalAdvocatePageContent,
  getContactPageContent,
  getStoryBySlug,
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
import { blogSearchFilter } from "../middlewares/filters/blogSearchFilter.js";
import faqFilters from "../middlewares/filters/faqFilters.js";
import { resourceFilters } from "../middlewares/filters/resourceFilters.js";
const appRoutes = express.Router();

appRoutes.post("/contact-form", validate(contactSchema), saveContactForm); //✅

appRoutes
  .post(
    "/submit-story",
    uploadMultiple.array("uploads", appConfig.max_story_uploads_length),
    jsonParser(["story_issue_type"]),
    validate(createStoryValidation),
    createStory,
  )
  .get("/hoa-horror-stories/:slug", getStoryBySlug)
  .get(
    "/hoa-horror-stories",
    pagination,
    sortingFilters,
    storyFilters,
    getStoryByFilters,
  );

//needs testing
appRoutes.post(
  "/non-legal-advocate/create",
  uploadMultiple.array("adv_uploads", appConfig.max_story_uploads_length),
  validate(createNonLegalAdvocateValidation),
  createNonLegalAdvocate,
);

appRoutes //✅
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

appRoutes.get(
  "/blogs",
  pagination,
  sortingFilters,
  blogSearchFilter,
  getBlogListing,
);
appRoutes.get("/blog/:id", getSingleBlog);

appRoutes.get("/faqs", faqFilters, getFaqs);

appRoutes.get("/privacy-policy", getPrivacyPolicy);
appRoutes.get("/terms-of-use", getTermsOfUse);

appRoutes.get(
  "/resources",
  pagination,
  sortingFilters,
  resourceFilters,
  getResources,
);
appRoutes.get("/settings", getClientWebsiteSettings);
appRoutes.get("/content/:pageKey", getPageContent);

appRoutes.get("/home-page-content", getHomeContent);
appRoutes.get("/about-page-content", getAboutPageContent);
appRoutes.get(
  "/non-legal-advocate-page-content",
  getNonLegalAdvocatePageContent,
);
appRoutes.get("/contact-page-content", getContactPageContent);

export default appRoutes;
