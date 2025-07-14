import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "proved product name"],
    },
    image: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ], 
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default:0
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    currentPrice: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("product", ProductSchema);
