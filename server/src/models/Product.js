import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model("Product", productSchema);
