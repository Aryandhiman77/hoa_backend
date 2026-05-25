import ApiResponse from "../utils/apiResponse.js";
import { ApiError, BadRequestError } from "../utils/apiError.js";
import Contact from "../Models/contact.js";
import AsyncHandler from "../utils/asyncHandler.js";
import contactformsubmitted from "../html/contactformsubmitted.js";
import Notification from "../Models/notification.js";
import Story from "../Models/story.js";
import unlinkFiles from "../utils/fileUnlinker.js";
import storySubmitted from "../html/storySubmitted.js";

// 4.1 contact form api
export const saveContactForm = AsyncHandler(async (req, res) => {
  const saveData = await Contact.create(req.data);

  if (!saveData) {
    throw new BadRequestError("Submission failed, please try again.");
  }
  // mail to submitter.
  await mailSender({
    from: "support@hoa.com",
    to: req.data.email,
    subject: "Contact form submitted.",
    html: contactformsubmitted(req.data.name),
  });
  await Notification.create({
    title: "Contact Form Submitted",
    description: "A new user has submitted the contact form.",
    type: "info",
    receiverRole: "admin",
    relatedModule: "contact",
    relatedId: saveData._id,
    actionUrl: `/admin/contacts/${saveData._id}`,
  });
  return res
    .status(201)
    .json(new ApiResponse.created("Contact form submitted.", saveData));
});

// 4.2 Submit Your Story Form

const uploadedFiles = (files) => {
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

export const submitYourStory = AsyncHandler(async (req, res, next) => {
  try {
    let storyObject = { ...req.data };
    if (req.files) {
      storyObject = { ...storyObject, ...uploadedFiles(req.files) };
    }
    const saved = await Story.create(storyObject);
    if (!saved) {
      throw new BadRequestError("Submission failed, please try again.");
    }
    await mailSender({
      from: "support@hoa.com",
      to: req.data.email,
      subject: "Story submitted",
      html: storySubmitted(saved.story_name),
    });
    await Notification.create({
      title: "Story Form Submitted",
      description: "A new user has submitted a story.",
      type: "info",
      receiverRole: "admin",
      relatedModule: "story",
      relatedId: saved._id,
      actionUrl: `/admin/stories/${saved._id}`,
    });
    return res
      .status(201)
      .json(new ApiResponse.created("Story submitted successfully.", saved));
  } catch (error) {
    if (req.files) {
      unlinkFiles(req.files);
    }
    next(error);
  }
});
