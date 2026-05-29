// title, slug, hero_title, hero_body, sections/modules, SEO title, meta description, featured image, publish status

import mongoose from "mongoose";

const pageSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: null,
    },

    body: {
      type: String,
      trim: true,
      default: null,
    },

    image: {
      type: String,
      trim: true,
      default: null,
    },

    buttonText: {
      type: String,
      trim: true,
      default: null,
    },

    buttonUrl: {
      type: String,
      trim: true,
      default: null,
    },

    items: {
      type: Array,
      default: [],
    },
  },
  { _id: false },
);

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    hero_title: {
      type: String,
      required: true,
      trim: true,
    },

    hero_body: {
      type: String,
      required: true,
      trim: true,
    },

    sections: {
      type: [pageSectionSchema],
      default: [],
    },

    seo_title: {
      type: String,
      required: true,
      trim: true,
    },

    meta_description: {
      type: String,
      required: true,
      trim: true,
    },

    featured_image: {
      type: String,
      trim: true,
      default: null,
    },

    publish_status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

const Page = mongoose.model("Page", pageSchema);

pageSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

export default Page;
