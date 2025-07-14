import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "proved category name"],
    },
    image: {
      type: String,
      default: "",
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
  },
  { timestamps: true }
);

export const subcategoryModel = mongoose.model(
  "subCategory",
  subcategorySchema
);
