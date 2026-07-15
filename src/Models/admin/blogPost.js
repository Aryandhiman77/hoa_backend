import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required."], trim: true },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required."],
      trim: true,
    },
    body: { type: String, required: [true, "Body is required."], trim: true },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },
    tags: { type: [String], default: [] },
    featured_image: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["draft", "review", "published", "archived", "unpublish"],
      default: "draft",
    },
    seo_title: { type: String, trim: true, default: null },
    meta_description: { type: String, trim: true, default: null },
  },
  { timestamps: true },
);

blogSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    const generatedSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check uniqueness
    const existingBlog = await mongoose.models.BlogPost.findOne({
      slug: generatedSlug,
      _id: { $ne: this._id },
    });

    if (existingBlog) {
      throw new Error("Blog slug must be unique.");
    }

    this.slug = generatedSlug;
  }
});

const BlogPost = mongoose.model("BlogPost", blogSchema);

export default BlogPost;
