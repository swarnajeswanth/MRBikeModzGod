// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  image: string;
  role: "customer" | "retailer";
  wishlist: string[];
  dateOfBirth?: string;
  phoneNumber?: string;
  password: string; // ADDED
  requireOTPOnLogin?: boolean; // New field for retailers
  emailVerified?: boolean; // Track email verification status
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "retailer"],
      default: "customer",
    },
    wishlist: [
      {
        type: String,
      },
    ],
    dateOfBirth: {
      type: String,
      required: false,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: false,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    requireOTPOnLogin: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
