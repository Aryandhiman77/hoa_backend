import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true }, // e.g., "facebook", "twitter"
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const navigationLabelSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    dropdown: [
      {
        label: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
      },
    ],
  },
  { _id: false },
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: { type: [String], default: [] },
  },
  { _id: false },
);

const websiteSettingsSchema = new mongoose.Schema(
  {
    logo: {
      url: { type: String, required: true, trim: true },
      altText: { type: String, trim: true },
    },

    contactInfo: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
    },

    socialLinks: { type: [socialLinkSchema], default: [] },

    footer: {
      text: { type: String, trim: true },
      links: { type: [navigationLabelSchema], default: [] },
    },

    disclaimer: { type: String, trim: true },

    navigationLabels: { type: [navigationLabelSchema], default: [] },

    defaultSEO: { type: seoSchema },
  },
  { timestamps: true },
);

const WebsiteSettings = mongoose.model(
  "WebsiteSettings",
  websiteSettingsSchema,
);

export default WebsiteSettings;
