import mongoose from "mongoose";

const cmsSectionSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true }, // always required
    titleMain: { type: String, trim: true }, // optional
    titleSubtitle: { type: String, trim: true }, // optional
    content: { type: mongoose.Schema.Types.Mixed }, // optional now
    disclaimerText: { type: String, trim: true }, // optional
    checkboxText: { type: String, trim: true }, // optional
  },
  { _id: false },
);

const cmsFormFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true }, // text, textarea, select, checkbox, file
    placeholder: { type: String },
    description: { type: String },
    options: [String], // for select dropdowns
    required: { type: Boolean, default: false },
  },
  { _id: false },
);

const pageSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    sections: { type: [cmsSectionSchema], default: [] }, // optional for pages without sections
    formDefinition: { type: [cmsFormFieldSchema], default: [] }, // optional for pages without forms
  },
  { timestamps: true },
);

const CMSPage = mongoose.model("CMSPage", pageSchema);

export default CMSPage;
