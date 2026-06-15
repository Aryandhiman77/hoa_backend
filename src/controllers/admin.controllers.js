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
    .status(201)
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
    .status(201)
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
      .status(201)
      .json(ApiResponse.success("Blog updated successfully.", saved));
  } catch (error) {
    if (req.file) {
      unlinkFiles(req.file);
    }
    next(error);
  }
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

export const createResource = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("Featured image is required.");
  }
  try {
    const created = await Resource.create(req.data);
    if (!created) {
      throw new BadRequestError("Failed creating resource, please try again.");
    }
    return res
      .status(201)
      .json(ApiResponse.created("Resource created successfully.", created));
  } catch (error) {
    if (req.file) {
      unlinkFiles(req.file);
    }
    next(error);
  }
});

export const createPage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new BadRequestError("Featured image is required.");
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
