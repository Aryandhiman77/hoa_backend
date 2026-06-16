import mongoose from "mongoose";

const privacyPolicySchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Privacy Policy content is required."],
      trim: true,
    },
  },
  { timestamps: true },
);

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);
export default PrivacyPolicy;
