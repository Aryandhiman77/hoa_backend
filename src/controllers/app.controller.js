import ApiResponse from "../helpers/apiResponse.js";
import { ApiError, BadRequestError } from "../helpers/apiError.js";
import Contact from "../Models/submissionsQueue/contact.js";
import AsyncHandler from "../helpers/asyncHandler.js";
import contactformsubmitted from "../html/contactformsubmitted.js";
import Notification from "../Models/admin/notification.js";
import Story from "../Models/submissionsQueue/storySubmission.js";
import unlinkFiles from "../utils/fileUnlinker.js";
import storySubmitted from "../html/storySubmitted.js";
import NonLegalAdvocate from "../Models/submissionsQueue/nonLegalAdvocate.js";
import nonLegalAdvocateSubmitted from "../html/nonLegalAdvocate.js";
import Attorney from "../Models/submissionsQueue/attorneySubmission.js";
import attorneySubmissionSubmitted from "../html/attorneySubmissionSubmitted.js";
import mailsender from "../helpers/nodeMailer.js";
import mailSender from "../helpers/nodeMailer.js";

// 4.1 contact form api
export const saveContactForm = AsyncHandler(async (req, res) => {
  const saveData = await Contact.create(req.data);
  if (!saveData) {
    throw new BadRequestError("Submission failed, please try again.");
  }
  // mail to submitter.
  await mailSender({
    from: "support@hoa.com",
    to: req.data.contact_email,
    subject: "Contact form submitted.",
    html: contactformsubmitted(req.data.contact_name),
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
    .json(ApiResponse.created("Contact form submitted.", null));
});

// 4.2 Submit Your Story Form

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

export const createStory = AsyncHandler(async (req, res, next) => {
  try {
    let storyObject = { ...req.data };
    if (req.files) {
      storyObject = {
        ...storyObject,
        story_uploads: uploadedSubmitYourStoryFiles(req.files),
      };
    }
    const saved = await Story.create(storyObject);
    if (!saved) {
      throw new BadRequestError("Submission failed, please try again.");
    }
    await mailSender({
      from: "support@hoa.com",
      to: req.data.story_email,
      subject: "Story submitted",
      html: storySubmitted(saved.story_name),
    });
    /// admin side notification (uncomment if needed)
    await Notification.create({
      title: "Story Form Submitted",
      description: "A new user has submitted a story.",
      type: "info",
      receiverRole: "admin",
      relatedModule: "story",
      relatedId: saved._id,
      actionUrl: `/admin/stories/${saved._id}`,
    });
    return res.status(201).json(ApiResponse.created("Story submitted.", saved));
  } catch (error) {
    if (req.files) {
      unlinkFiles(req.files);
    }
    next(error);
  }
});

// 4.3 non-legal advocate form

const uploadNonLegalAdvocateFiles = (files) => {
  return (
    files?.map((file) => {
      let fileType = "other";

      if (file.mimetype.startsWith("image/")) {
        fileType = "image";
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
        fileUrl: `/temp/${file.filename}`,
        fileType,
        fileSize: file.size,
      };
    }) || []
  );
};

export const createNonLegalAdvocate = AsyncHandler(async (req, res, next) => {
  try {
    let advocateObject = { ...req.data };
    if (req.files) {
      advocateObject = {
        ...advocateObject,
        adv_uploads: uploadNonLegalAdvocateFiles(req.files),
      };
    }
    const saved = await NonLegalAdvocate.create(advocateObject);
    if (!saved) {
      throw new BadRequestError(
        "Failed to submit request for Non-Legal Advocate, please try again.",
      );
    }
    await mailSender({
      from: "support@hoa.com",
      to: saved.adv_email,
      subject: "Story submitted",
      html: nonLegalAdvocateSubmitted(saved.adv_name),
    });

    // admin side notification (uncomment if needed)
    await Notification.create({
      title: "Non-Legal-Advocate Added",
      description: "A new Non-Legal-Advocate has been added.",
      type: "info",
      receiverRole: "admin",
      relatedModule: "non-legal-advocate",
      relatedId: saved._id,
      actionUrl: `/admin/non-legal-advocate/${saved._id}`,
    });

    return res
      .status(201)
      .json(
        ApiResponse.created(
          "Your Non-Legal Advocate Request Has Been Submitted",
          saved,
        ),
      );
  } catch (error) {
    if (req.files) {
      unlinkFiles(req.files);
    }
    next(error);
  }
});

// 4.4 Attorney Submission form
export const createAttorneySubmission = AsyncHandler(async (req, res) => {
  const saved = await Attorney.create(req.data);
  if (!saved) {
    throw new BadRequestError(
      "Failed saving attorney submission, please try again.",
    );
  }
  // Optional: send acknowledgement email
  await mailSender({
    from: "support@hoa.com",
    to: saved.attorney_email,
    subject: "Your request for attorney submission has been submitted.",
    html: attorneySubmissionSubmitted(saved.attorney_name),
  });

  // Optional: admin side notification
  await Notification.create({
    title: "Attorney Submission Received",
    description: "A new attorney submission has been received.",
    type: "info",
    receiverRole: "admin",
    relatedModule: "attorney",
    relatedId: saved._id,
    actionUrl: `/admin/attorney-submissions/${saved._id}`,
  });

  return res
    .status(201)
    .json(ApiResponse.created("Attorney submission saved successfully."));
});

export const getHomeOwnerAttorneysByFilters = AsyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };

  const [attorneys, totalDocuments] = await Promise.all([
    Attorney.find(req.hoa_query)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select(
        "-_id -createdAt -updatedAt -approvedAt -isPublished -status -attorney_disclaimer_ack",
      )
      .lean(),

    Attorney.countDocuments(req.hoa_query),
  ]);
  return res
    .status(201)
    .json(ApiResponse.paginated(attorneys, page + 1, limit, totalDocuments));
});

export const getStoryByFilters = AsyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };
  const [stories, totalDocuments] = await Promise.all([
    Story.find(req.story_query)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select(
        "-_id story_name story_city story_state story_hoa_name story_issue_type story_summary story_anonymous status",
      )
      .lean(),

    Story.countDocuments(req.story_query),
  ]);

  return res
    .status(201)
    .json(ApiResponse.paginated(stories, page + 1, limit, totalDocuments));
});
