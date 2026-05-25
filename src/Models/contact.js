import mongoose from "mongoose";

const contactform = new mongoose.Schema(
  {
    contact_name: {
      type: String,
      required: [true, "Name is required."],
    },
    contact_email: {
      type: String,
      required: [true, "Email is required."],
    },
    contact_phone: {
      type: String,
    },
    contact_subject: {
      type: String,
      required: [true, "Subject is required."],
    },
    contact_message: {
      type: String,
      required: [true, "Message is required."],
    },
    status: {
      type: String,
      enum: ["new", "reviewed"],
      default: "new",
    },
  },
  { timestamps: true },
);

const Contact = new mongoose.model("contact", contactform);

export default Contact;
