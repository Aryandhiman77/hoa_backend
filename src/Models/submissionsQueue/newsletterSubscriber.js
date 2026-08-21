import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },

    firstName: {
      type: String,
      trim: true,
      maxlength: [100, "First name cannot exceed 100 characters."],
    },

    consent: {
      type: Boolean,
      required: [true, "Newsletter consent is required."],
      default: false,
    },

    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: {
      type: Date,
      default: null,
    },
    unsubscribeToken: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSubscriberSchema,
);

export default NewsletterSubscriber;
