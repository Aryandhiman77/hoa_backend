import mongoose from "mongoose";
import slugify from "slugify";

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Page title is required."],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    hero_title: {
      type: String,
      required: [true, "Hero title is required."],
      trim: true,
    },
    hero_body: {
      type: String,
      required: [true, "Hero body is required."],
      trim: true,
    },
    seo_title: {
      type: String,
      required: [true, "SEO title is required."],
      trim: true,
    },
    meta_description: {
      type: String,
      required: [true, "Meta description is required."],
      trim: true,
    },
    featured_image: {
      type: String,
      trim: true,
      default: null,
    },
    publish_status: {
      type: String,
      enum: ["draft", "review", "published", "archieved", "unpublish"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook: generate slug if not provided, otherwise keep provided slug
pageSchema.pre("save", async function () {
  try {
    if (!this.slug && this.title) {
      const generatedSlug = slugify(this.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      // Check uniqueness
      const existingPage = await mongoose.models.Page.findOne({
        slug: generatedSlug,
        _id: { $ne: this._id },
      });

      if (existingPage) {
        throw new Error("Page title is already taken, use a different 'title'");
      }

      this.slug = generatedSlug;
    }
    // If slug is provided explicitly, we use it as is
  } catch (err) {
    throw new Error(err.message);
  }
});

const Page = mongoose.model("Page", pageSchema);

export default Page;
