import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../helpers/apiResponse.js";
import Page from "../Models/admin/page.js";
import Story from "../Models/submissionsQueue/storySubmission.js";
import Attorney from "../Models/submissionsQueue/attorneySubmission.js";
import mailSender from "../helpers/nodeMailer.js";
import storyApproved from "../html/storyApproved.js";
import storyFlagged from "../html/storyFlagged.js";
import FAQ from "../Models/admin/faq.js";
import { BadRequestError, NotFoundError } from "../helpers/apiError.js";
import { appConfig } from "../configs/index.js";
import unlinkFiles from "../utils/fileUnlinker.js";
import { unlinkFilesFromServerUsingPath } from "../utils/unlinkFilesFromServerByPath.js";
import fs from "fs";
import { cwd } from "process";
import BlogPost from "../Models/admin/blogPost.js";
import PrivacyPolicy from "../Models/admin/privacyPolicy.js";
import TermsOfUse from "../Models/admin/termsOfUse.js";
import Resource from "../Models/admin/resource.js";
import WebsiteSettings from "../Models/admin/siteSettings.js";
import CMSPage from "../Models/admin/cms/CmsPage.js";
import HomePageCMS from "../Models/admin/cms/homePageCMS.js";
import AboutPageCMS from "../Models/admin/cms/aboutPageCMS.js";
import NonLegalAdvocateCMS from "../Models/admin/cms/nonLegalAdvocatePageCMS.js";
import ContactPageCMS from "../Models/admin/cms/contactPageCMS.js";
import { generateToken } from "../utils/tokenGenerator.js";
import AdminUser from "../Models/admin/adminUserSchema.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { generateAdminOtpEmail } from "../html/admin/otpEmail.js";
import bcrypt from "bcrypt";

export const getAdminLogin = asyncHandler(async (req, res) => {
  const email = req.body?.email;

  const password = req.body?.password;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const admin = await AdminUser.findOne({ email }).select("+password");

  if (!admin) {
    throw new BadRequestError("Invalid credentials");
  }

  // TODO:

  const isMatch = await bcrypt.compare(password, admin.password);

  if (appConfig.IS_OTP_VERIFICATION_ENABLED) {
    const otp = generateOTP();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    admin.otp = otp;

    admin.otpExpiresAt = otpExpiresAt;
    const saved = await admin.save();
    await mailSender({
      to: admin.email,
      from: process.env.SUPPORT_MAIL,
      subject: "HOA Admin OTP",
      html: generateAdminOtpEmail({ otp, adminName: saved.name }),
    });

    return res.status(200).json(ApiResponse.success("OTP sent to your email"));
  } else {
    const token = generateToken(admin);
    const expiryMs = parseInt(process.env.AUTH_COOKIE_EXPIRY);
    admin.isVerified = true;
    admin.lastLogin = new Date();
    const saved = await admin.save();
    if (!saved) {
      throw new BadRequestError("Failed to login, please try again.");
    }
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiryMs,
      sameSite: "strict",
    });

    return res.status(200).json(
      ApiResponse.success("Login succesful.", {
        authenticated: true,
        user: {
          name: saved.name,
          email: saved.email,
          lastLogin: saved.lastLogin,
        },
      }),
    );
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const email = req.body?.email;

  const otp = req.body?.otp;

  if (!email || !otp) {
    throw new BadRequestError("Email and OTP are required");
  }

  const admin = await AdminUser.findOne({ email });

  if (!admin) {
    throw new BadRequestError("Invalid credentials");
  }

  if (
    !admin.otp ||
    admin.otp !== otp ||
    !admin.otpExpiresAt ||
    admin.otpExpiresAt < new Date()
  ) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  admin.otp = null;
  admin.otpExpiresAt = null;
  admin.isVerified = true;
  admin.lastLogin = new Date();
  const saved = await admin.save();
  if (!saved) {
    throw new BadRequestError("Failed to login, please try again.");
  }

  const token = generateToken(admin);
  const expiryMs = parseInt(process.env.AUTH_COOKIE_EXPIRY);
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: expiryMs,
    sameSite: "strict",
  });

  return res.status(200).json(
    ApiResponse.success("OTP verified", {
      authenticated: true,
      user: {
        name: saved.name,
        email: saved.email,
        lastLogin: saved.lastLogin,
      },
    }),
  );
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(ApiResponse.success("Admin logged out successfully"));
});

export const updateStory = asyncHandler(async (req, res) => {
  try {
    if (req.params.id) {
      throw new NotFoundError(
        "Failed to find Story.",
        "story not found",
        "STORY_NOT_FOUND",
      );
    }
    let dataToBeSaved = req.data;
    if (req.file) {
      dataToBeSaved = { ...dataToBeSaved, featured_image: req.file.path };
    }
    const saved = await Page.findByIdAndUpdate(req.params?.id, dataToBeSaved);
    if (!saved) {
      throw new BadRequestError("Failed saving page, please try again.");
    }
    return res
      .status(200)
      .json(ApiResponse.success("Page saved successfully.", saved));
  } catch (error) {
    if (req.file) {
      unlinkFiles(req.file);
    }
    next(error);
  }
});

//

// export const updatePage = asyncHandler(async (req, res) => {
//   try {
//     if (req.params?.id) {
//       throw new BadRequestError("Failed to find page.");
//     }
//     let dataToBeSaved = req.data;
//     if (req.file) {
//       dataToBeSaved = { ...dataToBeSaved, featured_image: req.file.path };
//     }
//     const saved = await Page.findByIdAndUpdate(req.params?.id, dataToBeSaved);
//     if (!saved) {
//       throw new BadRequestError("Failed saving page, please try again.");
//     }
//     return res
//       .status(201)
//       .json(new ApiResponse.created("Page saved successfully.", saved));
//   } catch (error) {
//     if (req.file) {
//       unlinkFiles(req.file);
//     }
//     next(error);
//   }
// });

export const getStoriesByQuery = asyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };

  const [stories, totalDocuments] = await Promise.all([
    await Story.find(req.story_query)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select(
        "story_name story_city story_state story_hoa_name story_issue_type story_summary story_anonymous isPublished status",
      )
      .lean(),
    Story.countDocuments(req.story_query).lean(),
  ]);
  return res
    .status(201)
    .json(ApiResponse.paginated(stories, page + 1, limit, totalDocuments));
});

export const getStoryDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    throw new NotFoundError(
      "Failed to find Story.",
      "story not found",
      "STORY_NOT_FOUND",
    );
  }
  const details = await Story.findById(req.params?.id);
  if (!details) {
    throw new NotFoundError(
      "Failed to find Story.",
      "story not found",
      "STORY_NOT_FOUND",
    );
  }
  details.status = "under_review";
  details.reviewedAt = Date.now(); // save admin review date and time

  const saved = await details.save();
  if (!saved) {
    throw new BadRequestError("Failed to save review date.");
  }
  return res.status(200).json(ApiResponse.success("Story fetched.", saved));
});

export const updateStoryDetails = asyncHandler(async (req, res) => {
  const storyId = req.params?.id;
  if (!storyId) throw new BadRequestError("Story ID required.");

  const story = await Story.findById(storyId);
  if (!story) throw new NotFoundError("Story not found.");

  // update editable fields
  story.story_name = req.data.story_name;
  story.story_city = req.data.story_city;
  story.story_state = req.data.story_state;
  story.story_hoa_name = req.data.story_hoa_name;
  story.story_issue_type = req.data.story_issue_type;
  story.story_summary = req.data.story_summary;
  story.story_body = req.data.story_body;
  story.story_anonymous = req.data.story_anonymous;
  story.adminNotes = req.data.adminNotes;

  // handle status changes
  switch (req.data.status) {
    case "approved":
      story.status = "approved";
      story.isApproved = true;
      break;
    case "published":
      if (!story.isApproved) throw new BadRequestError("Must approve first.");
      story.status = "published";
      story.isPublished = true;
      break;
    case "flagged":
      story.status = "flagged";
      break;
    case "unpublished":
      story.status = "unpublished";
      break;
    case "archived":
      story.status = "archived";
      break;
    default:
      story.status = req.data.status || story.status;
  }

  const savedStory = await story.save();

  // await sendStoryEmail(savedStory, savedStory.status);

  return res
    .status(200)
    .json(ApiResponse.success("Story updated.", savedStory));
});

const uploadedSubmitYourStoryFiles = (files) => {
  return (
    files?.map((file) => {
      let fileType = "other";

      if (file.mimetype.startsWith("image/")) {
        fileType = "image";
      } else if (file.mimetype.startsWith("video/")) {
        fileType = "video";
      } else if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        fileType = "document";
      }

      return {
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType,
        fileSize: file.size,
      };
    }) || []
  );
};

export const updateStoryMedia = asyncHandler(async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new NotFoundError(
        "Failed to find Story.",
        "story not found",
        "STORY_NOT_FOUND",
      );
    }
    if (!req.files) {
      throw new BadRequestError(
        "Story media files are required.",
        "story media is required",
        "STORY_UPLOADS_REQUIRED",
      );
    }
    const story = await Story.findById(req.params?.id);
    if (!story) {
      throw new NotFoundError(
        "Failed to find Story.",
        "story not found",
        "STORY_NOT_FOUND",
      );
    }

    const currentStoryMediaLengthInDb = story.story_uploads.length || 0;
    const totalLengthAfterNewMedia =
      req.files?.length + currentStoryMediaLengthInDb;
    if (totalLengthAfterNewMedia > appConfig.max_story_uploads_length) {
      throw new BadRequestError(
        `Maximum ${appConfig.max_story_uploads_length} media files can be uploaded.`,
        "Story uploads limit exceeded.",
        "STORY_UPLOADS_LIMIT_EXCEEDED",
      );
    }
    const saved = await Story.findByIdAndUpdate(
      req.params.id,
      {
        $push: { story_uploads: uploadedSubmitYourStoryFiles(req.files) },
      },
      { returnDocument: "after" },
    );
    if (!saved) {
      throw new BadRequestError(
        "Failed to save media updates, please try again.",
      );
    }
    return res
      .status(200)
      .json(ApiResponse.success("Story media updated.", saved));
  } catch (error) {
    if (req.files) {
      unlinkFiles(req.files);
    }
    next(error);
  }
});

export const removeMediaFromStory = asyncHandler(async (req, res, next) => {
  const storyId = req.params?.id;
  const fileUrls = Array.isArray(req.body.fileUrls) ? req.body.fileUrls : [];

  if (!storyId) throw new NotFoundError("Story not found.", "STORY_NOT_FOUND");
  if (!fileUrls.length)
    throw new BadRequestError(
      "No media selected.",
      "No media selected.",
      "NO_MEDIA_SELECTED_FOR_DELETION",
    );

  const story = await Story.findById(storyId);
  if (!story)
    throw new NotFoundError(
      "Story not found.",
      "Story not found.",
      "STORY_NOT_FOUND",
    );

  // Remove references from DB (exact fileUrl match)
  const updatedStory = await Story.findByIdAndUpdate(
    storyId,
    { $pull: { story_uploads: { fileUrl: { $in: fileUrls } } } },
    { new: true },
  );

  if (!updatedStory)
    throw new BadRequestError("Failed to delete media, please try again.");

  // Delete files from server and track failures
  const failedIndexes = await unlinkFilesFromServerUsingPath(fileUrls);

  if (failedIndexes.length) {
    return next(
      new BadRequestError(
        `Failed to delete files at indexes: ${failedIndexes.join(", ")}`,
        "SOME_FILES_NOT_DELETED",
      ),
    );
  }

  return res.status(200).json(ApiResponse.success("Story media deleted."));
});

export const getAttorneysByQuery = asyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };

  const [attorneys, totalDocuments] = await Promise.all([
    Attorney.find(req.attorney_query)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select("-approvedAt -isPublished -attorney_disclaimer_ack")
      .lean(),

    Attorney.countDocuments(req.attorney_query),
  ]);
  return res
    .status(201)
    .json(ApiResponse.paginated(attorneys, page + 1, limit, totalDocuments));
});

export const getSingleAttorney = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const attorney = await Attorney.findById(req.params.id);
  if (!attorney) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  attorney.status = "under_review";
  attorney.reviewedAt = Date.now();

  const saved = await attorney.save();
  if (!saved) {
    throw new BadRequestError(
      "Failed to find attorney.",
      "Attorney not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  // trigger mail to user

  return res.status(200).json(ApiResponse.success("Attorney found.", saved));
});

export const updateAttorneyDetails = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const updated = await Attorney.findByIdAndUpdate(req.params.id, req.data, {
    returnDocument: "after",
  });
  if (!updated) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Attorney updated.", updated));
});
export const approveAttorney = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const updated = await Attorney.findByIdAndUpdate(
    req.params.id,
    {
      status: "approved",
      isApproved: true,
    },
    { returnDocument: "after" },
  );
  if (!updated) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Attorney approved.", updated));
});
export const declineAttorney = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const updated = await Attorney.findByIdAndUpdate(
    req.params.id,
    {
      status: "declined",
      declineReason:
        req.data?.declineReason || "Team didn't posted reason of rejection.",
      isApproved: false,
      isPublished: false,
    },
    { returnDocument: "after" },
  );
  if (!updated) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Attorney declined.", updated));
});
export const publishAttorney = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const attorney = await Attorney.findById(req.params.id);
  if (!attorney.isApproved) {
    throw new NotFoundError(
      "Approve attorney first.",
      "Approve attorney first.",
      "ATTORNEY_NOT_APPROVED",
    );
  }

  attorney.isPublished = true;
  attorney.status = "published";

  const saved = await attorney.save();
  if (!saved) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Attorney published.", saved));
});
export const unPublishAttorney = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const attorney = await Attorney.findById(req.params.id);
  if (!attorney.isApproved) {
    throw new BadRequestError(
      "Approve attorney first.",
      "Approve attorney first.",
      "ATTORNEY_NOT_APPROVED",
    );
  }
  if (!attorney.isPublished) {
    throw new BadRequestError(
      "Publish attorney first.",
      "Publish attorney first.",
      "ATTORNEY_NOT_PUBLISHED",
    );
  }

  attorney.isPublished = false;
  attorney.status = "unpublished";

  const saved = await attorney.save();
  if (!saved) {
    throw new BadRequestError(
      "Failed to publish Attorney.",
      "Failed to publish Attorney.",
      "FAILED_TO_PUBLISH_ATTORNEY",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Attorney unpublished.", saved));
});
export const archieveAttorney = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const attorney = await Attorney.findByIdAndUpdate(
    req.params.id,
    {
      status: "archieved",
    },
    { returnDocument: "after" },
  );
  if (!req.params?.id) {
    throw new NotFoundError(
      "Attorney not found.",
      "Attorey not found",
      "ATTORNEY_NOT_FOUND",
    );
  }
  const saved = await attorney.save();
  if (!saved) {
    throw new BadRequestError(
      "Failed to archieve Attorney.",
      "Failed to archieve Attorney.",
      "FAILED_TO_ARCHIEVE_ATTORNEY",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Attorney archieved.", saved));
});

export const createFaq = asyncHandler(async (req, res) => {
  const created = await FAQ.create(req.data);

  if (!created) {
    throw new BadRequestError("Failed creating faq, please try again.");
  }
  return res
    .status(201)
    .json(ApiResponse.created("FAQ created successfully.", created));
});

export const updateFaqDetails = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError("FAQ not found.", "FAQ not found", "FAQ_NOT_FOUND");
  }
  const saved = await FAQ.findByIdAndUpdate(req.params.id, req.data, {
    returnDocument: "after",
  });
  if (!saved) {
    throw new BadRequestError(
      `Failed to update FAQ.`,
      `Failed to update FAQ.`,
      "FAILED_TO_UPDATE_FAQ",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("FAQ updated successfully.", saved));
});

export const getSingleFaq = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError("FAQ not found.", "FAQ not found", "FAQ_NOT_FOUND");
  }
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    throw new NotFoundError("FAQ not found.", "FAQ not found", "FAQ_NOT_FOUND");
  }
  return res.status(201).json(ApiResponse.success("FAQ found.", faq));
});

export const getFaqs = asyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { sortOrder: 1, createdAt: -1 };

  const [FAQs, totalDocuments] = await Promise.all([
    FAQ.find(req.faq_query).sort(sorting).limit(limit).skip(skip).lean(),
    FAQ.countDocuments(req.faq_query).lean(),
  ]);
  return res
    .status(201)
    .json(ApiResponse.paginated(FAQs, page + 1, limit, totalDocuments));
});

export const changeFaqStatus = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError("FAQ not found.", "FAQ not found", "FAQ_NOT_FOUND");
  }
  const saved = await FAQ.findByIdAndUpdate(
    req.params.id,
    {
      publish_status: req.data.publish_status || "draft",
    },
    { returnDocument: "after" },
  );
  if (!saved) {
    throw new BadRequestError(
      `Failed to update status of FAQ to '${req.data.status}'.`,
      `Failed to update status of FAQ to '${req.data.status}'.`,
      "FAILED_TO_UPDATE_STATUS",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("FAQ updated successfully.", saved));
});

export const createBlog = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("Featured image is required.");
  }

  try {
    req.data = {
      ...req.data,
      featured_image: `/uploads/${req.file.filename}`,
    };

    const created = await BlogPost.create(req.data);

    if (!created) {
      throw new BadRequestError("Failed creating blog, please try again.");
    }

    return res
      .status(201)
      .json(ApiResponse.created("Blog created successfully.", created));
  } catch (error) {
    if (req.file) {
      await unlinkFiles(req.file);
    }
    throw error;
  }
});

export const getBlogs = asyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };

  const [blogPosts, totalDocuments] = await Promise.all([
    BlogPost.find(req.blog_query).sort(sorting).limit(limit).skip(skip).lean(),
    BlogPost.countDocuments(req.blog_query).lean(),
  ]);
  return res
    .status(201)
    .json(ApiResponse.paginated(blogPosts, page + 1, limit, totalDocuments));
});

export const getSingleBlog = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Blog not found.",
      "Blog not found",
      "Blog_NOT_FOUND",
    );
  }
  const blogPost = await BlogPost.findById(req.params.id);
  if (!blogPost) {
    throw new NotFoundError(
      "Blog not found.",
      "Blog not found",
      "BLOG_NOT_FOUND",
    );
  }
  return res.status(201).json(ApiResponse.success("Blog found.", blogPost));
});

export const updateBlogDetails = asyncHandler(async (req, res, next) => {
  try {
    if (!req.params?.id) {
      throw new NotFoundError(
        "Blog not found.",
        "Blog not found",
        "BLOG_NOT_FOUND",
      );
    }

    if (req.file) {
      // unlink previous files from server
      const previousBlog = await BlogPost.findById(req.params.id)
        .select("featured_image")
        .lean();
      if (!previousBlog) {
        throw new NotFoundError(
          "Blog not found.",
          "Blog not found",
          "BLOG_NOT_FOUND",
        );
      }
      const failedIndexes = await unlinkFilesFromServerUsingPath([
        previousBlog?.featured_image,
      ]);
      if (failedIndexes.length) {
        return next(
          new BadRequestError(
            `Failed to delete files at indexes: ${failedIndexes.join(", ")}`,
            "SOME_FILES_NOT_DELETED",
          ),
        );
      }
      // adding new file
      req.data = {
        ...req.data,
        featured_image: `/uploads/${req.file.filename}`,
      };
    }
    const saved = await BlogPost.findByIdAndUpdate(req.params.id, req.data, {
      returnDocument: "after",
    });
    if (!saved) {
      throw new BadRequestError(
        `Failed to update blog.`,
        `Failed to update blog.`,
        "FAILED_TO_UPDATE_BLOG",
      );
    }
    return res
      .status(200)
      .json(ApiResponse.success("Blog updated successfully.", saved));
  } catch (error) {
    if (req.file) {
      unlinkFiles(req.file);
    }
    next(error);
  }
});

export const updateBlogStatus = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Blog not found.",
      "Blog not found",
      "BLOG_NOT_FOUND",
    );
  }
  const saved = await BlogPost.findByIdAndUpdate(
    req.params?.id,
    { status: req.data?.status },
    {
      returnDocument: "after",
    },
  );
  if (!saved) {
    throw new BadRequestError("Failed changing blog status, please try again.");
  }
  return res
    .status(201)
    .json(
      ApiResponse.success(
        `Blog status changed to ${req.data?.publish_status}.`,
        saved,
      ),
    );
});

export const deleteBlog = asyncHandler(async (req, res, next) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Blog not found.",
      "Blog not found",
      "BLOG_NOT_FOUND",
    );
  }

  const deleted = await BlogPost.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new BadRequestError(
      `Failed to delete blog.`,
      `Failed to delete blog.`,
      "FAILED_TO_DELETE_BLOG",
    );
  }
  const failedIndexes = await unlinkFilesFromServerUsingPath([
    deleted.featured_image,
  ]);
  if (failedIndexes.length) {
    return next(
      new BadRequestError(
        `Failed to delete files at indexes: ${failedIndexes.join(", ")}`,
        "SOME_FILES_NOT_DELETED",
      ),
    );
  }

  return res
    .status(201)
    .json(ApiResponse.created("Blog deleted successfully.", null));
});

export const createPage = asyncHandler(async (req, res, next) => {
  try {
    if (req.file) {
      req.data = {
        ...req.data,
        featured_image: `/uploads/${req.file.filename}`,
      };
    }

    const saved = await Page.create(req.data);
    if (!saved) {
      throw new BadRequestError("Failed saving page, please try again.");
    }
    return res
      .status(201)
      .json(ApiResponse.created("Page saved successfully.", saved));
  } catch (error) {
    if (req.file) {
      unlinkFiles(req.file);
    }
    next(error);
  }
});
export const updatePage = asyncHandler(async (req, res, next) => {
  try {
    if (!req.params?.id) {
      throw new NotFoundError(
        "Page not found.",
        "Page not found",
        "PAGE_NOT_FOUND",
      );
    }
    const previousBlog = await Page.findById(req.params.id)
      .select("featured_image")
      .lean();
    if (!previousBlog) {
      throw new NotFoundError(
        "Page not found.",
        "Page not found",
        "PAGE_NOT_FOUND",
      );
    }
    if (req.file && previousBlog.featured_image) {
      // if new file delete that file and save new file

      const failedIndexes = await unlinkFilesFromServerUsingPath([
        previousBlog?.featured_image,
      ]);

      if (failedIndexes.length) {
        return next(
          new BadRequestError(
            `Failed to delete files at indexes: ${failedIndexes.join(", ")}`,
            "SOME_FILES_NOT_DELETED",
          ),
        );
      }
      // adding new file
      req.data = {
        ...req.data,
        featured_image: `/uploads/${req.file.filename}`,
      };
    }

    const saved = await Page.findByIdAndUpdate(req.params?.id, req.data, {
      returnDocument: "after",
    });
    if (!saved) {
      throw new BadRequestError("Failed saving page, please try again.");
    }
    return res
      .status(201)
      .json(ApiResponse.created("Page updated successfully.", saved));
  } catch (error) {
    if (req.file) {
      unlinkFiles(req.file);
    }
    next(error);
  }
});

export const deletePage = asyncHandler(async (req, res, next) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Page not found.",
      "Page not found",
      "PAGE_NOT_FOUND",
    );
  }
  const deleted = await Page.findByIdAndDelete(req.params.id);
  console.log(deleted);
  if (!deleted) {
    throw new BadRequestError(
      `Failed to delete page.`,
      `Failed to delete page.`,
      "FAILED_TO_DELETE_PAGE",
    );
  }
  const failedIndexes = await unlinkFilesFromServerUsingPath([
    deleted.featured_image,
  ]);
  if (failedIndexes.length) {
    return next(
      new BadRequestError(
        `Failed to delete files at indexes: ${failedIndexes.join(", ")}`,
        "SOME_FILES_NOT_DELETED",
      ),
    );
  }

  return res
    .status(201)
    .json(ApiResponse.success("Page deleted successfully.", null));
});

export const getPages = asyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { title: 1 };

  const [pages, totalDocuments] = await Promise.all([
    Page.find(req.page_filters).sort(sorting).limit(limit).skip(skip).lean(),
    Page.countDocuments(req.page_filters).lean(),
  ]);
  return res
    .status(201)
    .json(ApiResponse.paginated(pages, page + 1, limit, totalDocuments));
});

export const getSinglePage = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Page not found.",
      "Page not found",
      "Page_NOT_FOUND",
    );
  }
  const page = await Page.findById(req.params.id);
  if (!page) {
    throw new NotFoundError(
      "Page not found.",
      "Page not found",
      "PAGE_NOT_FOUND",
    );
  }
  return res.status(201).json(ApiResponse.success("Page found.", page));
});

export const updatePageStatus = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Page not found.",
      "Page not found",
      "Page_NOT_FOUND",
    );
  }
  const saved = await Page.findByIdAndUpdate(
    req.params?.id,
    { publish_status: req.data?.publish_status },
    {
      returnDocument: "after",
    },
  );
  if (!saved) {
    throw new BadRequestError("Failed changing page status, please try again.");
  }
  return res
    .status(201)
    .json(
      ApiResponse.success(
        `Page status changed to ${req.data?.publish_status}.`,
        saved,
      ),
    );
});

export const getPrivacyPolicy = asyncHandler(async (req, res) => {
  const privacyPolicy = await PrivacyPolicy.findOne().lean();
  return res
    .status(201)
    .json(ApiResponse.success("Privacy policy found.", privacyPolicy));
});

export const updatePrivacyPolicy = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Privacy policy not found.",
      "Privacy policy not found",
      "PRIVACY_POLICY_NOT_FOUND",
    );
  }
  const updated = await PrivacyPolicy.findByIdAndUpdate(
    req.params.id,
    req.data,
    {
      returnDocument: "after",
    },
  );
  if (!updated) {
    throw new NotFoundError(
      "Privacy policy not found.",
      "Privacy policy not found",
      "PRIVACY_POLICY_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Privacy policy updated.", updated));
});

export const getTermsOfUse = asyncHandler(async (req, res) => {
  const termsOfUse = await TermsOfUse.findOne().lean();
  return res
    .status(201)
    .json(ApiResponse.success("Terms of use found.", termsOfUse));
});
export const updateTermsOfUse = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Terms of use not found.",
      "Terms of use not found",
      "TERMS_OF_USE_NOT_FOUND",
    );
  }
  const updated = await TermsOfUse.findByIdAndUpdate(req.params.id, req.data, {
    returnDocument: "after",
  });
  if (!updated) {
    throw new NotFoundError(
      "Terms of use not found.",
      "Terms of use not found",
      "TERMS_OF_USE_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Terms of use updated.", updated));
});

export const createResource = asyncHandler(async (req, res, next) => {
  if (!req.files?.featured_image || !req.files.featured_image[0]) {
    throw new BadRequestError("Featured image is required.");
  }
  try {
    const resourceData = { ...req.data };
    resourceData.featured_image = `/uploads/${req.files.featured_image[0].filename}`;
    if (req.files?.file?.[0]) {
      const uploadedFile = req.files.file[0];
      resourceData.file = {
        fileName: uploadedFile.originalname,
        fileUrl: `/uploads/${uploadedFile.filename}`,
        fileType: uploadedFile.mimetype.startsWith("image/")
          ? "image"
          : uploadedFile.mimetype.startsWith("video/")
            ? "video"
            : "document",
        fileSize: uploadedFile.size,
      };
    }

    const saved = await Resource.create(resourceData);
    if (!saved) {
      throw new BadRequestError("Failed creating resource, please try again.");
    }

    return res
      .status(201)
      .json(ApiResponse.created("Resource created successfully.", saved));
  } catch (error) {
    if (req.files?.featured_image[0]) {
      unlinkFiles(req.files?.featured_image[0]);
    }
    if (req.files?.file[0]) {
      unlinkFiles(req.files?.file[0]);
    }
    next(error);
  }
});

export const getResources = asyncHandler(async (req, res, next) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { title: 1 };

  const [resources, totalDocuments] = await Promise.all([
    Resource.find(req.resource_filters)
      .select("title slug category featured_image status")
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .lean(),
    Resource.countDocuments(req.resource_filters).lean(),
  ]);
  return res
    .status(200)
    .json(ApiResponse.paginated(resources, page + 1, limit, totalDocuments));
});

export const updateResource = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    throw new NotFoundError(
      "Resource ID is required.",
      "Resource not found",
      "RESOURCE_NOT_FOUND",
    );
  }
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      throw new NotFoundError(
        "Resource not found.",
        "Resource not found",
        "RESOURCE_NOT_FOUND",
      );
    }
    const resourceData = { ...req.data };

    if (req.files?.featured_image?.[0]) {
      if (resource.featured_image) {
        await unlinkFilesFromServerUsingPath([resource.featured_image]);
      }
      resourceData.featured_image = `/uploads/${req.files.featured_image[0].filename}`;
    }
    if (req.files?.file?.[0]) {
      if (resource.file?.fileUrl) {
        await unlinkFilesFromServerUsingPath([resource.file.fileUrl]);
      }
      const uploadedFile = req.files.file[0];
      resourceData.file = {
        fileName: uploadedFile.originalname,
        fileUrl: `/uploads/${uploadedFile.filename}`,
        fileType: uploadedFile.mimetype.startsWith("image/")
          ? "image"
          : uploadedFile.mimetype.startsWith("video/")
            ? "video"
            : "document",
        fileSize: uploadedFile.size,
      };
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      resourceData,
      {
        returnDocument: "after",
      },
    );
    if (!updatedResource) {
      throw new BadRequestError("Failed updating resource, please try again.");
    }

    return res
      .status(200)
      .json(
        ApiResponse.success("Resource updated successfully.", updatedResource),
      );
  } catch (error) {
    if (req.files?.featured_image[0]) {
      unlinkFiles(req.files?.featured_image[0]);
    }
    if (req.files?.file[0]) {
      unlinkFiles(req.files?.file[0]);
    }
    next(error);
  }
});

export const updateResourceStatus = asyncHandler(async (req, res, next) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Resource not found.",
      "Resource not found",
      "RESOURCE_NOT_FOUND",
    );
  }
  const saved = await Resource.findByIdAndUpdate(
    req.params?.id,
    { status: req.data?.status },
    {
      returnDocument: "after",
    },
  );
  if (!saved) {
    throw new BadRequestError(
      "Failed changing resource status, please try again.",
    );
  }
  return res
    .status(201)
    .json(
      ApiResponse.success(
        `Resource status changed to ${req.data?.status}.`,
        saved,
      ),
    );
});

export const settingsUpdationController = asyncHandler(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new NotFoundError(
          "Settings not found.",
          "Settings not found",
          "SETTINGS_NOT_FOUND",
        );
      }

      const settings = await WebsiteSettings.findById(id);
      if (!settings) {
        throw new NotFoundError(
          "Settings not found.",
          "Settings not found",
          "SETTINGS_NOT_FOUND",
        );
      }

      // handle logo upload
      if (req.file) {
        try {
          // unlink previous logo file
          if (settings.logo?.url) {
            await unlinkFilesFromServerUsingPath([settings.logo.url]);
          }
        } catch (err) {
          console.error("Failed to delete previous logo:", err.message);
        }

        req.data = {
          ...req.data,
          logo: {
            url: `/uploads/${req.file.filename}`,
            altText: req.data?.logo?.altText || "HomeOwnersAssociation",
          },
        };
      } else if (req.data?.logo?.altText) {
        // update only altText if no new file
        req.data = {
          ...req.data,
          logo: {
            url: settings.logo?.url || "/uploads/default-logo.png",
            altText: req.data.logo.altText || "HomeOwnersAssociation",
          },
        };
      }

      const updated = await WebsiteSettings.findByIdAndUpdate(
        id,
        req.data,
        { new: true }, // return the updated document
      );

      if (!updated) {
        throw new BadRequestError(
          "Failed changing website settings, please try again.",
        );
      }

      return res
        .status(200)
        .json(ApiResponse.success("Website settings updated.", updated));
    } catch (error) {
      // if file was uploaded, remove it on error
      if (req.file) {
        try {
          await unlinkFilesFromServerUsingPath([
            `/uploads/${req.file.filename}`,
          ]);
        } catch (err) {
          console.error(
            "Failed to cleanup uploaded file on error:",
            err.message,
          );
        }
      }
      next(error);
    }
  },
);

export const getWebsiteSettings = asyncHandler(async (req, res) => {
  const settings = await WebsiteSettings.findOne().lean();
  if (!settings) {
    throw new NotFoundError(
      "Settings not found.",
      "Settings not found",
      "SETTINGS_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Website settings found.", settings));
});

export const cmsManager = asyncHandler(async (req, res, next) => {
  try {
    const cmsId = req.params?.id;
    if (!cmsId) {
      throw new NotFoundError(
        "CMS not found.",
        "CMS not found",
        "CMS_NOT_FOUND",
      );
    }

    const CMS = await CMSPage.findById(cmsId);
    if (!CMS) {
      throw new NotFoundError(
        "CMS not found.",
        "CMS not found",
        "CMS_NOT_FOUND",
      );
    }

    const updatedData = { ...req.data };

    // Handle uploaded images
    if (req.files) {
      const filesToRemove = [];

      // featured_image1 → featured_image_left
      if (req.files.featured_image1?.[0]) {
        if (CMS.featured_image_left) {
          filesToRemove.push(CMS.featured_image_left);
        }
        updatedData.featured_image_left = `/uploads/${req.files.featured_image1[0].filename}`;
      }

      // featured_image2 → featured_image_right
      if (req.files.featured_image2?.[0]) {
        if (CMS.featured_image_right) {
          filesToRemove.push(CMS.featured_image_right);
        }
        updatedData.featured_image_right = `/uploads/${req.files.featured_image2[0].filename}`;
      }

      // Unlink previous files
      if (filesToRemove.length) {
        await unlinkFilesFromServerUsingPath(filesToRemove);
      }
    }

    // Update CMS page
    const saved = await CMSPage.findByIdAndUpdate(cmsId, updatedData, {
      returnDocument: "after",
    });

    return res
      .status(200)
      .json(ApiResponse.success("CMS page updated successfully.", saved));
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      if (req.files.featured_image1?.[0]) {
        unlinkFilesFromServerUsingPath([
          `/uploads/${req.files.featured_image1[0].filename}`,
        ]);
      }
      if (req.files.featured_image2?.[0]) {
        unlinkFilesFromServerUsingPath([
          `/uploads/${req.files.featured_image2[0].filename}`,
        ]);
      }
    }
    next(error);
  }
});

export const getCmsData = asyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Page Content not found.",
      "Page Content not found",
      "PAGE_CONTENT_NOT_FOUND",
    );
  }
  const cmsdata = await CMSPage.findById(req.params.id).lean();
  return res.status(200).json(ApiResponse.success("CMS data found.", cmsdata));
});

export const manageHomePageCMS = asyncHandler(async (req, res, next) => {
  try {
    const cmsId = req.params?.id;
    if (!cmsId) {
      throw new NotFoundError(
        "Home CMS not found.",
        "Home CMS not found",
        "CMS_CONTENT_NOT_FOUND",
      );
    }

    // Fetch existing CMS document
    const CMS = await HomePageCMS.findById(cmsId);
    if (!CMS) {
      throw new NotFoundError(
        "Home CMS not found.",
        "Home CMS not found",
        "CMS_CONTENT_NOT_FOUND",
      );
    }

    // Start with existing CMS data
    const updatedData = CMS.toObject();

    // === HERO SECTION UPDATE ===
    updatedData.hero = updatedData.hero || {};
    if (req.body.hero) {
      updatedData.hero.subtitle =
        req.body.hero.subtitle ?? updatedData.hero.subtitle;
      updatedData.hero.introText =
        req.body.hero.introText ?? updatedData.hero.introText;
      updatedData.hero.disclaimerCheckboxText =
        req.body.hero.disclaimerCheckboxText ??
        updatedData.hero.disclaimerCheckboxText;
      updatedData.hero.buttons =
        req.body.hero.buttons ?? updatedData.hero.buttons;
    }

    // Handle featured_image1 (hero)
    if (!updatedData.hero.featured_image1)
      updatedData.hero.featured_image1 = {};
    if (req.files?.featured_image1?.[0]) {
      // Remove old image if exists
      if (CMS.hero.featured_image1?.url) {
        await unlinkFilesFromServerUsingPath([CMS.hero.featured_image1.url]);
      }
      updatedData.hero.featured_image1.url = `/uploads/${req.files.featured_image1[0].filename}`;
    }
    if (req.body.featured_image1_alt) {
      updatedData.hero.featured_image1.altText = req.body.featured_image1_alt;
    }

    // === HIGHLIGHT SECTION UPDATE ===
    updatedData.highlight = updatedData.highlight || {};
    if (req.body.highlight) {
      updatedData.highlight.heading =
        req.body.highlight.heading ?? updatedData.highlight.heading;
      updatedData.highlight.subHeading =
        req.body.highlight.subHeading ?? updatedData.highlight.subHeading;
    }

    // === PROPERTY COMPARISON SECTION UPDATE ===
    updatedData.propertyComparison = updatedData.propertyComparison || {};
    if (req.body.propertyComparison) {
      updatedData.propertyComparison.mainText =
        req.body.propertyComparison.mainText ??
        updatedData.propertyComparison.mainText;
      updatedData.propertyComparison.highlightText =
        req.body.propertyComparison.highlightText ??
        updatedData.propertyComparison.highlightText;
      updatedData.propertyComparison.disclaimer =
        req.body.propertyComparison.disclaimer ??
        updatedData.propertyComparison.disclaimer;
    }

    // Handle featured_image2 (propertyComparison)
    if (!updatedData.propertyComparison.featured_image2)
      updatedData.propertyComparison.featured_image2 = {};
    if (req.files?.featured_image2?.[0]) {
      if (CMS.propertyComparison.featured_image2?.url) {
        await unlinkFilesFromServerUsingPath([
          CMS.propertyComparison.featured_image2.url,
        ]);
      }
      updatedData.propertyComparison.featured_image2.url = `/uploads/${req.files.featured_image2[0].filename}`;
    }
    if (req.body.featured_image2_alt) {
      updatedData.propertyComparison.featured_image2.altText =
        req.body.featured_image2_alt;
    }

    // Save updated document
    const saved = await HomePageCMS.findByIdAndUpdate(cmsId, updatedData, {
      returnDocument: "after",
    });
    if (!saved) {
      throw new BadRequestError(
        "Failed to save changes, please try again.",
        "Failed to save changes, please try again.",
        "FAILED_TO_SAVE_CHANGES",
      );
    }
    return res
      .status(200)
      .json(ApiResponse.success("Home CMS updated successfully.", saved));
  } catch (error) {
    // Cleanup uploaded files on error
    if (req.files?.featured_image1?.[0]) {
      unlinkFiles(req.files?.featured_image1?.[0]);
    }
    if (req.files?.featured_image2?.[0]) {
      unlinkFiles(req.files?.featured_image2?.[0]);
    }
    next(error);
  }
});

export const getHomeCMS = asyncHandler(async (req, res, next) => {
  const cms = await HomePageCMS.findOne().lean();
  if (!cms) {
    throw new NotFoundError(
      "Home CMS not found.",
      "Home CMS not found",
      "CMS_CONTENT_NOT_FOUND",
    );
  }
  return res.status(200).json(ApiResponse.success("Home CMS found.", cms));
});

export const getNonLegalAdvocateCMS = asyncHandler(async (req, res, next) => {
  const cms = await NonLegalAdvocateCMS.findOne().lean();
  if (!cms) {
    throw new NotFoundError(
      "Non-legal-Advocate CMS not found.",
      "Non-legal-Advocate CMS not found",
      "CMS_CONTENT_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Non-legal-Advocate Page CMS found.", cms));
});
export const aboutPageCMS = asyncHandler(async (req, res, next) => {
  const cms = await AboutPageCMS.findOne().lean();
  if (!cms) {
    throw new NotFoundError(
      "Non-legal-Advocate CMS not found.",
      "Non-legal-Advocate CMS not found",
      "CMS_CONTENT_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Non-legal-Advocate Page CMS found.", cms));
});

export const getContactPageCMS = asyncHandler(async (req, res, next) => {
  const cms = await ContactPageCMS.findOne().lean();
  if (!cms) {
    throw new NotFoundError(
      "Contact Page CMS not found.",
      "Contact Page CMS not found",
      "CMS_CONTENT_NOT_FOUND",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("Contact Page CMS found.", cms));
});
export const manageAboutPageCMS = asyncHandler(async (req, res) => {
  const cmsId = req.params?.id;
  if (!cmsId) {
    throw new NotFoundError(
      "Home CMS not found.",
      "Home CMS not found",
      "CMS_CONTENT_NOT_FOUND",
    );
  }

  const saved = await AboutPageCMS.findByIdAndUpdate(cmsId, req.data, {
    returnDocument: "after",
  });
  if (!saved) {
    throw new BadRequestError(
      "Failed to save changes, please try again.",
      "Failed to save changes, please try again.",
      "FAILED_TO_SAVE_CHANGES",
    );
  }
  return res
    .status(200)
    .json(ApiResponse.success("About CMS updated successfully.", saved));
});

export const manageNonLegalAdvocateCMS = asyncHandler(async (req, res) => {
  try {
    const cmsId = req.params?.id;
    if (!cmsId) {
      throw new NotFoundError(
        "CMS not found",
        "CMS not found",
        "CMS_NOT_FOUND",
      );
    }

    const CMS = await NonLegalAdvocateCMS.findById(cmsId);
    if (!CMS) {
      throw new NotFoundError(
        "CMS not found",
        "CMS not found",
        "CMS_NOT_FOUND",
      );
    }

    const updatedData = { ...req.body };

    // Handle uploaded images
    const filesToRemove = [];

    // Featured image
    if (req.files?.featured_image?.[0]) {
      if (CMS.featured_image1?.url) filesToRemove.push(CMS.featured_image1.url);
      updatedData.featured_image1 = {
        url: `/uploads/${req.files.featured_image[0].filename}`,
        altText: updatedData.featured_image_alt || "",
      };
    }

    // Background image
    if (req.files?.background_image?.[0]) {
      if (CMS.background_image?.url)
        filesToRemove.push(CMS.background_image.url);
      updatedData.background_image = {
        url: `/uploads/${req.files.background_image[0].filename}`,
        altText: updatedData.background_image_alt || "",
      };
    }

    // Unlink old images
    if (filesToRemove.length) {
      await unlinkFilesFromServerUsingPath(filesToRemove);
    }

    // Remove alt fields from body to prevent duplication
    delete updatedData.featured_image_alt;
    delete updatedData.background_image_alt;

    // Update CMS document
    const saved = await NonLegalAdvocateCMS.findByIdAndUpdate(
      cmsId,
      updatedData,
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Non-Legal Advocate CMS updated successfully.",
      data: saved,
    });
  } catch (error) {
    // Cleanup uploaded files if error
    if (req.files) {
      // Cleanup uploaded files on error
      if (req.files?.featured_image?.[0]) {
        unlinkFiles(req.files?.featured_image?.[0]);
      }
      if (req.files?.background_image?.[0]) {
        unlinkFiles(req.files?.background_image?.[0]);
      }
      next(error);
    }
    next(error);
  }
});

export const manageContactPageCMS = asyncHandler(async (req, res, next) => {
  const cmsId = req.params?.id;
  if (!cmsId) {
    throw new NotFoundError("CMS not found", "CMS not found", "CMS_NOT_FOUND");
  }

  const CMS = await ContactPageCMS.findById(cmsId);
  if (!CMS) {
    throw new NotFoundError("CMS not found", "CMS not found", "CMS_NOT_FOUND");
  }

  const updatedData = { ...req.body };

  // Ensure formFields length never exceeds schema (max 4)
  if (updatedData.formFields?.length > 4) {
    updatedData.formFields = updatedData.formFields.slice(0, 4);
  }

  // Update CMS document
  const saved = await ContactPageCMS.findByIdAndUpdate(cmsId, updatedData, {
    returnDocument: "after",
    upsert: true,
  });

  return res
    .status(200)
    .json(ApiResponse.success("Contact page CMS updated successfully.", saved));
});
