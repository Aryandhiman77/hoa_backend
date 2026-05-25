import mongoose from "mongoose";

const admin = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  { timestamps: true },
);

const Admin = new mongoose.model("admin", contactform);

export default Contact;
