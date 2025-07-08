import mongoose, { Schema, Document, models, model } from "mongoose";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDocument extends Document {
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  misc?: string;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    misc: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Order || model<OrderDocument>("Order", OrderSchema);
