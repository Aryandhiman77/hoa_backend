import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "light"],
      default: "info",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    receiverRole: {
      type: String,
      enum: ["admin", "super_admin"],
      default: "admin",
    },

    relatedModule: {
      type: String,
      enum: ["contact", "story", "attorney", "non-legal-advocate"],
      default: "general",
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    actionUrl: {
      type: String,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
