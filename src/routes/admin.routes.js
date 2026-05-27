import { Router } from "express";
import validate from "../middlewares/validate.js";
import {
  createPageValidation,
  updatePageValidation,
} from "../validations/adminValidations/page.js";
import {
  createPage,
  getStoryDetails,
  updatePage,
  updateStoryDetails,
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.js";

const adminRouter = Router();

//6.Pages - title, slug, hero_title, hero_body, sections/modules, SEO title, meta description, featured image, publish status
adminRouter.post(
  "/page/create",
  upload.single("featured_image"),
  validate(createPageValidation),
  createPage,
);
adminRouter.put(
  "/page/update/:id",
  upload.single("featured_image"),
  validate(updatePageValidation),
  updatePage,
);

//6. Stories
adminRouter.get("/story/details/:id", getStoryDetails);

adminRouter.put("/story/update/:id", updateStoryDetails);

export default adminRouter;
