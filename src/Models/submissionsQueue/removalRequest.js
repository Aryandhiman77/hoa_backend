import mongoose from "mongoose";

const removalRequest = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: [true, "Case ID is required."],
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    reason: {
      type: String,
      required: [true, "Removal reason is required."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "rejected", "approved"],
      default: "new",
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    removedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const RemovalRequest = mongoose.model("removalRequest", removalRequest);

export default RemovalRequest;
