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
} from "../controllers/admin.controllers.js";
import { upload, uploadMultiple } from "../middlewares/multer.js";
import { updateStoryValidation } from "../validations/story.validations.js";
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
const adminRouter = Router();

//6. Stories - ✅ (tested and working)
//!!-> controls like flagged/approve/publish/unpublish api's must be separate, must not be in updateStoryDetails
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
  .delete("/story/remove-uploads/:id", removeMediaFromStory);

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
  .get("/faq/:id", getSingleFaq) //✅
  .get(
    "/faqs", //✅
    pagination,
    faqFilters,
    getFaqs,
  )
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

export default adminRouter;
