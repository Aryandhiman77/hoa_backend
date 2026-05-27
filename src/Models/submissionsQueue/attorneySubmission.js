import mongoose from "mongoose";

const attorneySubmissionSchema = new mongoose.Schema(
  {
    attorney_name: {
      type: String,
      required: true,
      trim: true,
    },

    attorney_firm: {
      type: String,
      required: true,
      trim: true,
    },

    attorney_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    attorney_phone: {
      type: String,
      required: true,
      trim: true,
    },

    attorney_website: {
      type: String,
      trim: true,
      default: null,
    },

    attorney_city: {
      type: String,
      required: true,
      trim: true,
    },

    attorney_state: {
      type: String,
      required: true,
      trim: true,
    },

    attorney_county: {
      type: String,
      trim: true,
      default: null,
    },

    attorney_practice_areas: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Please select at least one practice area",
      },
    },

    attorney_summary: {
      type: String,
      required: true,
      trim: true,
    },

    attorney_bio: {
      type: String,
      trim: true,
      default: null,
    },

    attorney_disclaimer_ack: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "Attorney disclaimer acknowledgement is required",
      },
    },
    status: {
      type: String,
      enum: ["new", "under_review", "approved", "published", "archieved"],
      default: "new",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const AttorneySubmission = mongoose.model(
  "AttorneySubmission",
  attorneySubmissionSchema,
);

export default AttorneySubmission;
