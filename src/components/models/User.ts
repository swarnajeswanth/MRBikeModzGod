// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  image: string;
  role: "customer" | "retailer";
  wishlist: string[];
  dateOfBirth: string;
  phoneNumber: string;
  password: string; // ADDED
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["customer", "retailer"], required: true },
    wishlist: { type: [String], default: [] },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true, select: false }, // hashed, excluded by default
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
