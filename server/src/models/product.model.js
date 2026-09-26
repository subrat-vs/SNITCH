import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500,
      trim: true,
    },

    images: {
      type: [String],
      validate: {
        validator: (images) => images.length >= 1 && images.length <= 5,
        message: "A product can have at most 5 images",
      },
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        enum: ["INR", "USD"],
        default: "INR",
      },
    },

    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },

        stock: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
description