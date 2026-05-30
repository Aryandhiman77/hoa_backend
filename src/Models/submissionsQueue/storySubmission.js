import mongoose from "mongoose";
import slugify from "slugify";

const storyUploadSchema = new mongoose.Schema(
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
      enum: ["image", "document", "video", "other"],
      default: "other",
    },

    fileSize: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const storySchema = new mongoose.Schema(
  {
    story_name: {
      type: String,
      required: true,
      trim: true,
    },

    story_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    story_slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    story_phone: {
      type: String,
      trim: true,
      default: null,
    },

    story_city: {
      type: String,
      trim: true,
      default: null,
    },

    story_state: {
      type: String,
      required: true,
      trim: true,
    },

    story_hoa_name: {
      type: String,
      trim: true,
      default: null,
    },

    story_issue_type: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Please select at least one issue type",
      },
    },

    story_summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    story_body: {
      type: String,
      required: true,
      trim: true,
    },

    story_uploads: {
      type: [storyUploadSchema],
      default: [],
    },

    story_anonymous: {
      type: Boolean,
      required: true,
      default: false,
    },

    story_consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "Consent is required",
      },
    },

    story_disclaimer: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "Disclaimer agreement is required",
      },
    },

    status: {
      type: String,
      enum: [
        "new",
        "under_review",
        "flagged",
        "approved",
        "published",
        "unpublished",
        "archived",
      ],
      default: "new",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    adminNotes: {
      type: String,
      trim: true,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

storySchema.pre("save", function (next) {
  if (
    (this.isModified("story_hoa_name") || !this.story_slug) &&
    this.story_hoa_name
  ) {
    this.story_slug = slugify(this.story_hoa_name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  next();
});
const Story = mongoose.model("Story", storySchema);

export default Story;
