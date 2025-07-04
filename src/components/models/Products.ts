import mongoose, { Schema, model, models, Document } from "mongoose";

interface Product extends Document {
  id: string;
  name: string;
  label: string;
  labelType: string;
  backgroundColor: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount: string;
  description: string;
  features: string[];
  specifications: {
    Material: string;
    "Temperature Range": string;
    Compatibility: string;
    Warranty: string;
  };
  images: string[];
  inStock: boolean;
  stockCount: number;
}

const ProductSchema = new Schema<Product>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, default: "" },
    labelType: { type: String, default: "" },
    backgroundColor: { type: String, default: "#1f2937" },
    category: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String, default: "" },
    description: { type: String, default: "" },
    features: [{ type: String }],
    specifications: {
      Material: { type: String, default: "" },
      "Temperature Range": { type: String, default: "" },
      Compatibility: { type: String, default: "" },
      Warranty: { type: String, default: "" },
    },
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const ProductModel = models.Product || model<Product>("Product", ProductSchema);
export default ProductModel;
