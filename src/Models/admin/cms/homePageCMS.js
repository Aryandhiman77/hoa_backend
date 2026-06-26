import mongoose from "mongoose";

// Schema for buttons inside hero section
const buttonSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    style: { type: String, trim: true, default: "primary" },
  },
  { _id: false },
);

// Hero section
const heroSectionSchema = new mongoose.Schema(
  {
    featured_image1: {
      url: { type: String, trim: true }, // uploaded via multer
      altText: { type: String, trim: true, default: "" },
    },
    subtitle: { type: String, trim: true, required: true },
    buttons: { type: [buttonSchema], default: [] },
    disclaimerCheckboxText: { type: String, trim: true },
    introText: { type: String, trim: true },
  },
  { _id: false },
);

// Highlight section
const highlightSectionSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true, required: true },
    subHeading: { type: String, trim: true },
  },
  { _id: false },
);

// Property comparison section
const propertyComparisonSectionSchema = new mongoose.Schema(
  {
    featured_image2: {
      url: { type: String, trim: true }, // uploaded via multer
      altText: { type: String, trim: true, default: "" },
    },
    disclaimer: { type: String, trim: true },
    mainText: { type: String, trim: true },
    highlightText: { type: String, trim: true },
  },
  { _id: false },
);

const homePageSchema = new mongoose.Schema(
  {
    pageKey: { type: String, default: "home", unique: true },
    hero: { type: heroSectionSchema, required: true },
    highlight: { type: highlightSectionSchema, required: true },
    propertyComparison: {
      type: propertyComparisonSectionSchema,
      required: true,
    },
  },
  { timestamps: true },
);

const HomePageCMS = mongoose.model("HomePageCMS", homePageSchema);

export default HomePageCMS;
