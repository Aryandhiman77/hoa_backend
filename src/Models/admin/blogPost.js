import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required."],
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

    body: {
      type: String,
      required: [true, "Body is required."],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    featured_image: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "review", "published", "unpublished", "archieved"],
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
  { timestamps: true },
);

const BlogPost = mongoose.model("BlogPost", blogSchema);

export default BlogPost;
