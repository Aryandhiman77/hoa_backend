import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    placeholder: { type: String, trim: true },
  },
  { _id: false },
);

const contactPageSchema = new mongoose.Schema(
  {
    pageKey: { type: String, default: "contact", unique: true },

    heading: { type: String, required: true, trim: true }, // "Contact Us Privately"
    subHeading: { type: String, trim: true }, // "Private • Non-Legal • Informational"
    description: { type: String, trim: true, required: true }, // descriptive text below subHeading

    formFields: { type: [formFieldSchema], default: [] },

    privacyText: { type: String, trim: true }, // "Our information will be processed as detailed in our Privacy Policy"
  },
  { timestamps: true },
);

const ContactPageCMS = mongoose.model("ContactPageCMS", contactPageSchema);

export default ContactPageCMS;
