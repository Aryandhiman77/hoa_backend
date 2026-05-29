import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../helpers/apiResponse.js";
import Page from "../Models/admin/page.js";
import Story from "../Models/submissionsQueue/storySubmission.js";
import mailSender from "../helpers/nodeMailer.js";
import storyApproved from "../html/storyApproved.js";
import storyFlagged from "../html/storyFlagged.js";
import { BadRequestError, NotFoundError } from "../helpers/apiError.js";
import { appConfig } from "../configs/index.js";
import unlinkFiles from "../utils/fileUnlinker.js";
import { unlinkFilesFromServerUsingPath } from "../utils/unlinkFilesFromServerByPath.js";
import fs from "fs";
import { cwd } from "process";

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

//
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

  const details = await Story.find(req.story_query);
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
  if (!req.params.id) {
    throw new BadRequestError("Failed to find story.");
  }
  const story = await Story.findById(req.params.id);
  story.story_name = req.data.story_name;
  story.story_city = req.data.story_city;
  story.story_state = req.data.story_state;
  story.story_hoa_name = req.data.story_hoa_name;
  story.story_issue_type = req.data.story_issue_type;
  story.story_summary = req.data.story_summary;
  story.story_body = req.data.story_body;
  story.story_anonymous = req.data.story_anonymous;
  story.adminNotes = req.data.adminNotes;

  if (req.data.status === "approved" && story.status !== "approved") {
    story.status = "approved";
    story.isApproved = true;
    const updatedStory = await story.save();
    await mailSender({
      from: "support@hoa.com",
      to: story.story_email,
      subject: "Story approved.",
      html: storyApproved(
        story.story_name,
        story.story_hoa_name,
        `/hoa-horror-stories/${updatedStory.story_slug}`,
      ),
    });
  } else if (req.data.status === "publish" && !story.isApproved) {
    throw new BadRequestError("Story must be approved before publishing.");
  } else if (req.data.status === "flagged") {
    story.status = "flagged";
    const updatedStory = await story.save();
    await mailSender({
      from: "support@hoa.com",
      to: story.story_email,
      subject: "Story approved.",
      html: storyFlagged(story.story_name, story.story_hoa_name),
    });
  } else if (story.status === "archived") {
    story.status = "archived";
  } else if (story === "published" && isApproved) {
    story.status = "published";
    const updatedStory = await story.save();
    await mailSender({
      from: "support@hoa.com",
      to: story.story_email,
      subject: "Story approved.",
      html: storyApproved(
        story.story_name,
        story.story_hoa_name,
        `/hoa-horror-stories/${updatedStory.story_slug}`,
      ),
    });
  }
  const saved = await story.save();
  if (!saved) {
    throw new BadRequestError("Failed to save updates, please try again.");
  }
  return res.status(200).json(ApiResponse.success("Story updated.", saved));
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
