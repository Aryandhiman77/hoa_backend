  import mongoose from "mongoose";

  // Schema for each card in the white rounded boxes
  const cardSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [48, "Card title cannot be longer than 48 characters."],
      },
      description: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, "Description cannot be longer than 100 characters."],
      },
    },
    { _id: false },
  );

  const buttonSchema = new mongoose.Schema(
    {
      text: { type: String, required: true, trim: true },
      link: { type: String, required: true, trim: true },
      style: { type: String, trim: true, default: "red-text-white" },
    },
    { _id: false },
  );
  const nonLegalAdvocateSchema = new mongoose.Schema(
    {
      pageKey: { type: String, default: "non-legal-advocate", unique: true },

      featured_image1: {
        url: { type: String, trim: true },
        altText: { type: String, trim: true, default: "" },
      },

      background_image: {
        url: { type: String, trim: true },
        altText: { type: String, trim: true, default: "" },
      },
      heroHeading: {
        type: String,
        required: true,
        trim: true,
        maxLength: [40, "Hero Heading cannot be longer than 48 characters."],
      },
      subtitle: { type: String, trim: true, required: true },
      description: { type: String, trim: true, required: true },
      buttons: { type: [buttonSchema], default: [] },
      cards: { type: [cardSchema], default: [] },
    },
    { timestamps: true },
  );

  const NonLegalAdvocateCMS = mongoose.model(
    "NonLegalAdvocateCMS",
    nonLegalAdvocateSchema,
  );

  export default NonLegalAdvocateCMS;
