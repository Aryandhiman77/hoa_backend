import asyncHandler from "../utils/asyncHandler";
import Page from "../Models/admin/page";
import ApiResponse from "../utils/apiResponse";
import Story from "../Models/submissionsQueue/storySubmission";

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
      .json(new ApiResponse.created("Page saved successfully.", saved));
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
      throw new BadRequestError("Failed to find page.");
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
      .json(new ApiResponse.success("Page saved successfully.", saved));
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

export const getStoryDetails = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError("Failed to find story.");
  }
  const details = await Story.findById(req.params?.id);
  details.reviewedAt = Date.now(); // save admin review date and time

  const saved = await details.save();
  if (!saved) {
    throw new BadRequestError("Failed to save review date.");
  }
  return res.status(200).json(new ApiResponse.success("Story fetched.", saved));
});

export const updateStoryDetails = asyncHandler(async (req, res) => {
    
});
