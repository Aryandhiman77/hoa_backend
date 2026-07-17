import ApiResponse from "../helpers/apiResponse.js";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../helpers/apiError.js";
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
import BlogPost from "../Models/admin/blogPost.js";
import FAQ from "../Models/admin/faq.js";
import PrivacyPolicy from "../Models/admin/privacyPolicy.js";
import TermsOfUse from "../Models/admin/termsOfUse.js";
import Resource from "../Models/admin/resource.js";
import WebsiteSettings from "../Models/admin/siteSettings.js";
import CMSPage from "../Models/admin/cms/CmsPage.js";
import HomePageCMS from "../Models/admin/cms/homePageCMS.js";
import AboutPageCMS from "../Models/admin/cms/aboutPageCMS.js";
import NonLegalAdvocateCMS from "../Models/admin/cms/nonLegalAdvocatePageCMS.js";
import ContactPageCMS from "../Models/admin/cms/contactPageCMS.js";

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
    .status(200)
    .json(ApiResponse.paginated(attorneys, page + 1, limit, totalDocuments));
});

export const getStoryByFilters = AsyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };
  let [stories, totalDocuments] = await Promise.all([
    Story.find(req.story_query)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select(
        "-_id story_name story_email story_city story_state story_hoa_name story_issue_type story_summary story_anonymous status story_slug",
      )
      .lean(),

    Story.countDocuments(req.story_query),
  ]);

  stories = stories?.map((item) => {
    if (item.story_anonymous) {
      delete item["story_name"];
      delete item["story_email"];
      delete item["story_phone"];
      return item;
    } else {
      return item;
    }
  });

  return res
    .status(200)
    .json(ApiResponse.paginated(stories, page + 1, limit, totalDocuments));
});

export const getStoryBySlug = AsyncHandler(async (req, res) => {
  if (!req.params?.slug) {
    throw new NotFoundError(
      "Story not found.",
      "Story not found.",
      "STORY_NOT_FOUND",
    );
  }
  const story = await Story.findOne({
    story_slug: req.params.slug,
    isPublished: true,
    status: "published",
  })
    .select(
      "-_id -updatedAt -flagReason -adminNotes -isApproved -isPublished -status -story_disclaimer -story_consent",
    )
    .lean();
  if (!story) {
    throw new NotFoundError(
      "Story not found.",
      "Story not found.",
      "STORY_NOT_FOUND",
    );
  }
  if (story.story_anonymous) {
    delete story["story_name"];
    delete story["story_email"];
    delete story["story_phone"];
  }
  return res.status(200).json(ApiResponse.success("Story found.", story));
});

export const getBlogListing = AsyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };

  const [blogs, totalDocuments] = await Promise.all([
    BlogPost.find(req.blog_search_query)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select(
        "-_id -seo_title -meta_description -createdAt -__v -status  -body -tags",
      )
      .lean(),

    BlogPost.countDocuments(req.blog_search_query),
  ]);

  return res
    .status(200)
    .json(ApiResponse.paginated(blogs, page + 1, limit, totalDocuments));
});

export const getSingleBlog = AsyncHandler(async (req, res) => {
  if (!req.params?.id) {
    throw new NotFoundError(
      "Blog not found.",
      "Blog not found",
      "BLOG_NOT_FOUND",
    );
  }
  const blog = await BlogPost.findById(req.params.id).select(
    "-_id -__v -createdAt",
  );
  if (!blog) {
    throw new NotFoundError(
      "Blog not found.",
      "Blog not found",
      "BLOG_NOT_FOUND",
    );
  }
  return res.status(200).json(ApiResponse.success("Blog found.", blog));
});

export const getFaqs = AsyncHandler(async (req, res) => {
  const [faqs, totalDocuments] = await Promise.all([
    FAQ.find(req.faq_query)
      .sort({ sortOrder: "asc" })
      .select("-_id -publish_status -sortOrder -createdAt -updatedAt -__v")
      .lean(),

    FAQ.countDocuments(req.faq_query),
  ]);

  return res.status(200).json(ApiResponse.success("Data fetched.", faqs));
});

export const getPrivacyPolicy = AsyncHandler(async (req, res) => {
  const privacyPolicy = await PrivacyPolicy.findOne()
    .select("-_id -createdAt")
    .lean();
  return res
    .status(200)
    .json(ApiResponse.success("Privacy Policy found.", privacyPolicy));
});
export const getTermsOfUse = AsyncHandler(async (req, res) => {
  const termsOfUse = await TermsOfUse.findOne()
    .select("-_id -createdAt")
    .lean();
  return res
    .status(200)
    .json(ApiResponse.success("Terms of use found.", termsOfUse));
});
export const getResources = AsyncHandler(async (req, res) => {
  const limit = req.pagination_query?.limit || 10;
  const skip = req.pagination_query?.skip || 0;
  const page = req.pagination_query?.page || 0;
  const sorting = req.sorting_query || { createdAt: -1 };

  const [resources, totalDocuments] = await Promise.all([
    Resource.find(req.resource_filters)
      .sort(sorting)
      .limit(limit)
      .skip(skip)
      .select({
        "file.fileName": 0,
        _id: 0,
        seo_title: 0,
        meta_description: 0,
        createdAt: 0,
        __v: 0,
        status: 0,
      })
      .lean(),

    Resource.countDocuments(req.resource_filters),
  ]);

  return res
    .status(200)
    .json(ApiResponse.paginated(resources, page + 1, limit, totalDocuments));
});

export const getClientWebsiteSettings = AsyncHandler(async (req, res) => {
  const settings = await WebsiteSettings.findOne().select("-_id").lean();
  if (!settings) {
    throw new NotFoundError(
      "Settings not found.",
      "Settings not found",
      "SETTINGS_NOT_FOUND",
    );
  }
  return res.status(200).json(ApiResponse.success("Data found.", settings));
});

export const getPageContent = AsyncHandler(async (req, res) => {
  if (!req.params?.pageKey) {
    throw new NotFoundError(
      "Page Content not found.",
      "Page Content not found",
      "PAGE_CONTENT_NOT_FOUND",
    );
  }
  const content = await CMSPage.findOne({ pageKey: req.params.pageKey })
    .select("-_id")
    .lean();
  return res.status(200).json(ApiResponse.success("Content found.", content));
});
export const getHomeContent = AsyncHandler(async (req, res) => {
  const content = await HomePageCMS.findOne({ pageKey: "home" })
    .select("-_id -__v -createdAt")
    .lean();
  return res.status(200).json(ApiResponse.success("Content found.", content));
});
export const getAboutPageContent = AsyncHandler(async (req, res) => {
  const content = await AboutPageCMS.findOne({ pageKey: "about" })
    .select("-_id -__v -createdAt")
    .lean();
  return res.status(200).json(ApiResponse.success("Content found.", content));
});
export const getNonLegalAdvocatePageContent = AsyncHandler(async (req, res) => {
  const content = await NonLegalAdvocateCMS.findOne({
    pageKey: "non-legal-advocate",
  })
    .select("-_id -__v -createdAt")
    .lean();
  return res.status(200).json(ApiResponse.success("Content found.", content));
});
export const getContactPageContent = AsyncHandler(async (req, res) => {
  const content = await ContactPageCMS.findOne({
    pageKey: "contact",
  })
    .select("-_id -__v -createdAt")
    .lean();
  return res.status(200).json(ApiResponse.success("Content found.", content));
});
