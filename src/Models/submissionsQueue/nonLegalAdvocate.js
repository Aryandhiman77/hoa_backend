import mongoose from "mongoose";

const advocateUploadSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ["image", "document", "other"],
      default: "other",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const nonLegalAdvocateSchema = new mongoose.Schema(
  {
    adv_name: {
      type: String,
      required: true,
      trim: true,
    },

    adv_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    adv_phone: {
      type: String,
      required: true,
      trim: true,
    },

    adv_state: {
      type: String,
      required: true,
      trim: true,
    },

    adv_hoa_name: {
      type: String,
      trim: true,
      default: null,
    },

    adv_issue_summary: {
      type: String,
      required: true,
      trim: true,
    },

    adv_estimated_damages: {
      type: String,
      trim: true,
      default: null,
    },

    adv_key_dates: {
      type: String,
      trim: true,
      default: null,
    },

    adv_uploads: {
      type: [advocateUploadSchema],
      default: [],
    },

    adv_disclaimer: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "Disclaimer is required",
      },
    },

    status: {
      type: String,
      enum: [
        "new",
        "under_review",
        "needs_follow_up",
        "flagged",
        "closed",
        "archieved",
      ],
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

const NonLegalAdvocate = mongoose.model(
  "NonLegalAdvocate",
  nonLegalAdvocateSchema,
);

export default NonLegalAdvocate;
