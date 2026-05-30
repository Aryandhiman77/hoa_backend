import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required."],
      trim: true,
    },

    answer: {
      type: String,
      required: [true, "Answer is required."],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      unique: true,
      min: [0, "Sort order cannot be negative."], // ensures positive
    },

    publish_status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;
