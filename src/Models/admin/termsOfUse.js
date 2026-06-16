import mongoose from "mongoose";

const termsOfUseSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Terms of Use content is required."],
      trim: true,
    },
  },
  { timestamps: true },
);

const TermsOfUse = mongoose.model("TermsOfUse", termsOfUseSchema);
export default TermsOfUse;
