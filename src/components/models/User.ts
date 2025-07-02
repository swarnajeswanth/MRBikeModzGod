import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  image: string;
  role: "customer" | "retailer";
  wishlist: string[];
  dateOfBirth: string;
  phoneNumber: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["customer", "retailer"], required: true },
    wishlist: { type: [String], default: [] },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
