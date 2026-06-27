import mongoose from "mongoose";

const aboutPageSchema = new mongoose.Schema(
  {
    pageKey: { type: String, default: "about", unique: true },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const AboutPageCMS = mongoose.model("AboutPageCMS", aboutPageSchema);
export default AboutPageCMS;
