import mongoose, { Document, Schema } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  role: "customer" | "retailer";
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      length: 6,
    },
    role: {
      type: String,
      enum: ["customer", "retailer"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Auto-delete expired OTPs
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for email and role
OTPSchema.index({ email: 1, role: 1 });

// Create index for OTP lookup
OTPSchema.index({ email: 1, otp: 1, role: 1 });

const OTP = mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);

export default OTP;
