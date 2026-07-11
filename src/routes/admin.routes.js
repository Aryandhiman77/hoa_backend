import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  createPageValidation,
  pageStatusValidation,
  updatePageValidation,
} from "../validations/adminValidations/page.js";
import {
  createPage,
  getAttorneysByQuery,
  getSingleAttorney,
  getStoriesByQuery,
  getStoryDetails,
  removeMediaFromStory,
  updateAttorneyDetails,
  approveAttorney,
  updateStoryDetails,
  updateStoryMedia,
  declineAttorney,
  publishAttorney,
  unPublishAttorney,
  archieveAttorney,
  createBlog,
  createFaq,
  changeFaqStatus,
  updateFaqDetails,
  getFaqs,
  getSingleFaq,
  getBlogs,
  getSingleBlog,
  updateBlogDetails,
  deleteBlog,
  updatePage,
  deletePage,
  getPages,
  getSinglePage,
  updatePageStatus,
  updateBlogStatus,
  getTermsOfUse,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  updateTermsOfUse,
  createResource,
  updateResource,
  getResources,
  updateResourceStatus,
  getWebsiteSettings,
  settingsUpdationController,
  cmsManager,
  getCmsData,
  manageHomePageCMS,
  getHomeCMS,
  manageAboutPageCMS,
  manageNonLegalAdvocateCMS,
  manageContactPageCMS,
  getAdminLogin,
  verifyOtp,
  logoutAdmin,
  getContactPageCMS,
  getNonLegalAdvocateCMS,
  aboutPageCMS,
  getNotifications,
  readNotification,
  deleteNotification,
  flagStory,
  approveStory,
  publishStory,
  unpublishStory,
  archiveStory,
  getDashboardRecordsCount,
  getContacts,
  editContactStatus,
  getNonLegalAdvocates,
  changeNonLegalAdvocateStatus,
  getSingleNonLegalAdvocate,
  updateNonLegalAdvocateDetails,
} from "../controllers/admin.controllers.js";
import { upload, uploadMultiple } from "../middlewares/multer.js";
import {
  storyFlagValidation,
  updateStoryValidation,
} from "../validations/story.validations.js";
import { storyFilters } from "../middlewares/filters/admin/storiesFilter.js";
import pagination from "../middlewares/filters/common/pagination.js";
import { appConfig } from "../configs/index.js";
import homeOwnerAttorneysFilters from "../middlewares/filters/homeOwnersAttorneys.js";
import attorneysFilters from "../middlewares/filters/admin/attorneyFilters.js";
import {
  declineAttorneySchema,
  updateAttorneySubmissionValidation,
} from "../validations/adminValidations/updateAttorney.js";
import {
  faqStatusValidation,
  faqValidationSchema,
} from "../validations/adminValidations/faq.js";
import faqFilters from "../middlewares/filters/admin/faqFilters.js";
import {
  blogStatusValidation,
  createblogValidationSchema,
  updateBlogValidationSchema,
} from "../validations/adminValidations/blogPost.js";
import { jsonParser } from "../utils/jsonParser.js";
import sortingFilters from "../middlewares/filters/common/sorting.js";
import blogFilters from "../middlewares/filters/admin/blogFilters.js";
import { pageFilters } from "../middlewares/filters/admin/pageFilters.js";
import {
  privacyPolicyValidationSchema,
  termsOfUseValidationSchema,
} from "../validations/adminValidations/legalPagesContentValidation.js";
import {
  createResourceValidationSchema,
  updateResourceStatusSchema,
  updateResourceValidationSchema,
} from "../validations/adminValidations/resourceValidations.js";
import { resourceFilters } from "../middlewares/filters/admin/resourceFilters.js";
import { websiteSettingsValidation } from "../validations/adminValidations/siteSettingsValidations.js";
import { cmsPageValidation } from "../validations/adminValidations/cms.validations.js";
import HomePageCMS from "../Models/admin/cms/homePageCMS.js";
import { homePageCMSValidation } from "../validations/adminValidations/cms/homePageCMSValidations.js";
import { aboutPageCMSValidation } from "../validations/adminValidations/cms/aboutPageCMSValidations.js";
import { nonLegalAdvocateCMSValidation } from "../validations/adminValidations/cms/nonLegalAdvocatePageCMSValidations.js";
import { contactPageCMSValidation } from "../validations/adminValidations/cms/contactPageCMSValidations.js";
import {
  adminLoginValidation,
  adminVerificationOTPValidation,
} from "../validations/adminValidations/login.validations.js";
import tokenVerification from "../middlewares/tokenVerification.js";
import notificationSearch from "../middlewares/filters/admin/notificationSearch.js";
import {
  authRateLimiter,
  logoutRateLimiter,
} from "../middlewares/rateLimits/rateLimits.js";
import { contactFilters } from "../middlewares/filters/admin/contactFilter.js";
import { editContactStatusValidation } from "../validations/adminValidations/editContactStatusValidation.js";
import { nonLegalAdvocateFilters } from "../middlewares/filters/admin/nonLegalAdvocate.js";
import { nonLegalAdvocateStatusValidation } from "../validations/adminValidations/nonLegalAdvocateStatusValidation.js";
import { nonLegalAdvocateValidationSchema } from "../validations/adminValidations/nonLegalAdvocateValidations.js";
const adminRouter = Router();

adminRouter.post(
  "/login",
  authRateLimiter,
  validate(adminLoginValidation),
  getAdminLogin,
);
adminRouter.post(
  "/verify-otp",
  authRateLimiter,
  validate(adminVerificationOTPValidation),
  verifyOtp,
);
adminRouter.get("/logout", logoutRateLimiter, logoutAdmin);

adminRouter.use(tokenVerification);

//6. Stories - ✅ (tested and working)
// todo -> upload review is pending in admin side
adminRouter
  .get("/stories", pagination, storyFilters, getStoriesByQuery)
  .get("/story/details/:id", getStoryDetails)
  .put("/story/update/:id", validate(updateStoryValidation), updateStoryDetails)
  .patch(
    "/story/add-uploads/:id",
    uploadMultiple.array("uploads", appConfig.max_story_uploads_length),
    updateStoryMedia,
  )
  .delete("/story/remove-uploads/:id", removeMediaFromStory)
  .patch(
    "/story/update-status/flag/:id",
    validate(storyFlagValidation),
    flagStory,
  )
  .patch("/story/update-status/approve/:id", approveStory)
  .patch("/story/update-status/publish/:id", publishStory)
  .patch("/story/update-status/unpublish/:id", unpublishStory)
  .patch("/story/update-status/archive/:id", archiveStory);

// attorneys listing (tested and working properly)
adminRouter
  .get("/attorney/listing", pagination, attorneysFilters, getAttorneysByQuery) //✅
  .get("/attorney/:id", getSingleAttorney) //✅

  //admin-controls//✅
  .put(
    "/attorney/update-details/:id",
    validate(updateAttorneySubmissionValidation),
    updateAttorneyDetails, //✅
  )
  .patch("/attorney/update-status/approve/:id", approveAttorney) //✅
  .patch(
    "/attorney/update-status/decline/:id",
    validate(declineAttorneySchema),
    declineAttorney, //✅
  )
  .patch("/attorney/update-status/publish/:id", publishAttorney) //✅
  .patch("/attorney/update-status/unpublish/:id", unPublishAttorney) //✅
  .patch("/attorney/update-status/archieve/:id", archieveAttorney); //✅

// faq //✅
adminRouter
  .post("/faq/create", validate(faqValidationSchema), createFaq) //✅
  .get(
    "/faqs", //✅
    pagination,
    faqFilters,
    getFaqs,
  )
  .get("/faq/:id", getSingleFaq) //✅
  .put(
    "/faq/update-details/:id", //✅
    validate(faqValidationSchema),
    updateFaqDetails,
  )
  .patch(
    "/faq/update-status/:id", //✅
    validate(faqStatusValidation),
    changeFaqStatus,
  );

// blogs api's //✅
adminRouter.post(
  "/blog/create",
  upload.single("featured_image"),
  jsonParser(["tags"]),
  validate(createblogValidationSchema),
  createBlog,
);
adminRouter.get("/blogs", pagination, blogFilters, sortingFilters, getBlogs);
adminRouter.get("/blog/:id", getSingleBlog);

adminRouter.put(
  "/blog/update-details/:id",
  upload.single("featured_image"),
  jsonParser(["tags"]),
  validate(updateBlogValidationSchema),
  updateBlogDetails,
);
adminRouter.delete("/blog/:id", deleteBlog);
adminRouter.patch(
  "/blog/update-status/:id",
  validate(blogStatusValidation),
  updateBlogStatus,
);

//6.Pages - title, slug, hero_title, hero_body, sections/modules, SEO title, meta description, featured image, publish status ✅
adminRouter.post(
  "/page/create",
  upload.single("featured_image"),
  validate(createPageValidation),
  createPage,
);
adminRouter.put(
  "/page/update-details/:id",
  upload.single("featured_image"),
  validate(updatePageValidation),
  updatePage,
);

adminRouter.get("/pages", pagination, sortingFilters, pageFilters, getPages);
adminRouter.get("/page/:id", getSinglePage);
adminRouter.patch(
  "/page/update-status/:id",
  validate(pageStatusValidation),
  updatePageStatus,
);
adminRouter.delete("/page/:id", deletePage);

// legal pages
adminRouter.get("/privacy-policy", getPrivacyPolicy);
adminRouter.put(
  "/privacy-policy/:id",
  validate(privacyPolicyValidationSchema),
  updatePrivacyPolicy,
);
adminRouter.get("/terms-of-use", getTermsOfUse);
adminRouter.put(
  "/terms-of-use/:id",
  validate(termsOfUseValidationSchema),
  updateTermsOfUse,
);

// resources api

adminRouter.post(
  "/resource/create",
  uploadMultiple.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validate(createResourceValidationSchema),
  createResource,
);
adminRouter.get(
  "/resources",
  pagination,
  sortingFilters,
  resourceFilters,
  getResources,
);
adminRouter.put(
  "/resource/update-details/:id",
  uploadMultiple.fields([
    { name: "featured_image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validate(updateResourceValidationSchema),
  updateResource,
);
adminRouter.patch(
  "/resource/update-status/:id",
  validate(updateResourceStatusSchema),
  updateResourceStatus,
);

adminRouter.put(
  "/settings/:id",
  upload.single("logo_image"),
  jsonParser([
    "logo",
    "contactInfo",
    "footer",
    "socialLinks",
    "navigationLabels",
    "defaultSEO",
  ]),
  validate(websiteSettingsValidation),
  settingsUpdationController,
);
adminRouter.get("/settings", getWebsiteSettings);
adminRouter.put(
  "/cms/:id",
  uploadMultiple.fields([
    { name: "featured_image1", maxCount: 1 },
    { name: "featured_image2", maxCount: 1 },
  ]),
  jsonParser(["sections", "formDefinition"]), // parse both arrays as JSON
  validate(cmsPageValidation),
  cmsManager,
);
adminRouter.get("/cms/:id", getCmsData);
adminRouter.put(
  "/home-cms/:id",
  uploadMultiple.fields([
    { name: "featured_image1", maxCount: 1 },
    { name: "featured_image2", maxCount: 1 },
  ]),
  jsonParser(["hero", "highlight", "propertyComparison"]),
  validate(homePageCMSValidation),
  manageHomePageCMS,
);
adminRouter.get("/home-cms", getHomeCMS);
adminRouter.get("/about-page-cms", aboutPageCMS);
adminRouter.put(
  "/about-cms/:id",
  validate(aboutPageCMSValidation),
  manageAboutPageCMS,
);
adminRouter.get(
  "/non-legal-advocate",
  pagination,
  sortingFilters,
  nonLegalAdvocateFilters,
  getNonLegalAdvocates,
);

adminRouter.get("/non-legal-advocate/:id", getSingleNonLegalAdvocate);

adminRouter.put(
  "/non-legal-advocate/update-details/:id",
  validate(nonLegalAdvocateValidationSchema),
  updateNonLegalAdvocateDetails,
);
adminRouter.patch(
  "/non-legal-advocate/change-status/:id",
  validate(nonLegalAdvocateStatusValidation),
  changeNonLegalAdvocateStatus,
);

adminRouter.get("/non-legal-advocate-cms", getNonLegalAdvocateCMS);
adminRouter.put(
  "/non-legal-advocate-cms/:id",
  uploadMultiple.fields([
    { name: "background_image", maxCount: 1 },
    { name: "featured_image", maxCount: 1 },
  ]),
  jsonParser(["buttons", "cards"]),
  validate(nonLegalAdvocateCMSValidation),
  manageNonLegalAdvocateCMS,
);
adminRouter.get(
  "/contacts",
  pagination,
  sortingFilters,
  contactFilters,
  getContacts,
);

adminRouter.patch(
  "/contact/update-status/:id",
  validate(editContactStatusValidation),
  editContactStatus,
);

adminRouter.get("/contact-page-cms", getContactPageCMS);
adminRouter.put(
  "/contact-page-cms/:id",
  validate(contactPageCMSValidation),
  manageContactPageCMS,
);

adminRouter.get(
  "/notifications",
  pagination,
  notificationSearch,
  getNotifications,
);
adminRouter.patch("/notification/:id/read", readNotification);
adminRouter.delete("/notification/:id", deleteNotification);

adminRouter.get("/records-count", getDashboardRecordsCount);

export default adminRouter;
