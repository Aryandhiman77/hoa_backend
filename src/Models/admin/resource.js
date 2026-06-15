import mongoose from "mongoose";
import slugify from "slugify";

const resourceFileSchema = new mongoose.Schema(
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
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    file: {
      type: resourceFileSchema,
      default: null,
    },

    featured_image: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    seo_title: {
      type: String,
      trim: true,
      default: null,
    },

    meta_description: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique slug from title
resourceSchema.pre("save", async function (next) {
  if ((this.isModified("title") || !this.slug) && this.title) {
    const generatedSlug = slugify(this.title, { lower: true, strict: true });

    const existingResource = await mongoose.models.Resource.findOne({
      slug: generatedSlug,
      _id: { $ne: this._id },
    });

    if (existingResource) {
      throw new Error("Resource slug must be unique.");
    }

    this.slug = generatedSlug;
  }
  next();
});

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;