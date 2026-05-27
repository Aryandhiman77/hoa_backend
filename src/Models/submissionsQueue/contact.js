import mongoose from "mongoose";

const contactform = new mongoose.Schema(
  {
    contact_name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    contact_email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    contact_phone: {
      type: String,
      trim: true,
      default: null,
    },
    contact_subject: {
      type: String,
      required: [true, "Subject is required."],
      trim: true,
    },
    contact_message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "under_review", "needs_followup", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("contact", contactform);

export default Contact;
