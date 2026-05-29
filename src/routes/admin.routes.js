import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  createPageValidation,
  updatePageValidation,
} from "../validations/adminValidations/page.js";
import {
  createPage,
  getStoriesByQuery,
  getStoryDetails,
  removeMediaFromStory,
  updateStoryDetails,
  updateStoryMedia,
} from "../controllers/admin.controllers.js";
import { upload, uploadMultiple } from "../middlewares/multer.js";
import { updateStoryValidation } from "../validations/story.validations.js";
import { storyFilters } from "../middlewares/filters/admin/storiesFilter.js";
import pagination from "../middlewares/filters/common/pagination.js";
import { appConfig } from "../configs/index.js";
const adminRouter = Router();

//6.Pages - title, slug, hero_title, hero_body, sections/modules, SEO title, meta description, featured image, publish status
adminRouter.post(
  "/page/create",
  upload.single("featured_image"),
  validate(createPageValidation),
  createPage,
);
// adminRouter.put(
//   "/page/update/:id",
//   upload.single("featured_image"),
//   validate(updatePageValidation),
//   updatePage,
// );

//6. Stories - ✅ (tested and working)
adminRouter
  .get("/stories", pagination, storyFilters, getStoriesByQuery)
  .get("/story/details/:id", getStoryDetails)
  .put("/story/update/:id", validate(updateStoryValidation), updateStoryDetails)
  .patch(
    "/story/add-media/:id",
    uploadMultiple.array("media", appConfig.max_story_uploads_length),
    updateStoryMedia,
  )
  .delete("/story/remove-media/:id", removeMediaFromStory);

export default adminRouter;
